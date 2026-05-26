import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../../database/prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private readonly configService: ConfigService
  ) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey) throw new Error('STRIPE_SECRET_KEY is not set');
    this.stripe = new Stripe(secretKey, { apiVersion: '2025-06-30.basil' });
  }

  private stripe: Stripe;

  async create(data: CreatePaymentDto) {
    return this.prisma.paymentHistory.create({
      data: {
        ...data,
        finalAmount: Number(data.amount),
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.paymentHistory.findMany({
      where: { userId },
      include: { teacher: true },
    });
  }

  //Lista os pagamentos por professor
  async findPaymentsByTeacher(teacherId: string) {
    return this.prisma.paymentHistory.findMany({
      where: { teacherId },
    });
  }

  //Cria o pagamento do usuario na Stripe
  async createStripePaymentIntent(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.monthlyFee || Number(user.monthlyFee) <= 0) {
      throw new BadRequestException('Invalid monthly fee');
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(Number(user.monthlyFee) * 100), // centavos
        currency: 'brl',
        payment_method_types: ['card'],
        metadata: {
          userId: user.id,
          description: `Mensalidade ${user.name}`,
        },
      });

      return { clientSecret: paymentIntent.client_secret };
    } catch (err) {
      console.error('Stripe error:', err);
      throw new InternalServerErrorException('Failed to create payment intent');
    }
  }

  async confirmPayment(userId: string, stripePaymentId?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { teacher: true },
    });
    if (!user) throw new NotFoundException('User not found');

    let fee = user.monthlyFee || 0
    let finalAmount = 0;
    let status = 'pending';
    let method = 'manual';
    let transactionId: string | null = null;

    if (stripePaymentId) {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(stripePaymentId);
      finalAmount = Number(paymentIntent.amount) / 100;
      status = paymentIntent.status;
      method = 'credit card';
      transactionId = stripePaymentId;
    } else if (user.monthlyFee) {
      finalAmount = Number(user.monthlyFee);
    }

    const payment = await this.prisma.paymentHistory.create({
      data: {
        userId: user.id,
        teacherId: user.teacherId!,
        fee,
        finalAmount,
        status,
        date: new Date(),
        transactionId: transactionId,
        method,
      },
    });

    return {
      message: 'Payment recorded successfully',
      payment,
    };
  }

}