import { Controller, Get, Post, Body, Param, NotFoundException, BadRequestException } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto, CreateCheckoutDto } from './dto/create-payment.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @Get(':userId')
  findByUser(@Param('userId') userId: string) {
    return this.paymentService.findByUser(userId);
  }
  @Post('checkout')
  async createCheckout(@Body() dto: CreateCheckoutDto) {
    return this.paymentService.createStripePaymentIntent(dto.userId);
  }

  @Post('confirm')
  async confirmPayment(@Body() body: { userId: string; stripePaymentId?: string }) {
    return this.paymentService.confirmPayment(body.userId, body.stripePaymentId);
  }
  //Pagamento por professor
  @Get('/teacher/:teacherId')
  findPaymentsByTeacher(@Param('teacherId') teacherId: string) {
    return this.paymentService.findPaymentsByTeacher(teacherId);
  }
}