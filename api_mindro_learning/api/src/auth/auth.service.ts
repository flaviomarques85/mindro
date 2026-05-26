
// src/auth/auth.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { RequestCodeDto } from './dto/request-code.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { addMinutes, isAfter } from 'date-fns';
import * as jwt from 'jsonwebtoken';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) { }
  private readonly jwtSecret = 'Uq0yXrBiN2708NppTvVf24iVTj4F8gLJ';
  private readonly jwtKey = 'VFE0cKlVjnll1euNUrYxZC7Sjk0dGloS';

  generateToken(payload: Record<string, any>): string {
    return jwt.sign(
      {
        iss: this.jwtKey,
        algorithm: 'HS256',
        expiresIn: '1h',
      },
      this.jwtSecret
    );
  }

  async createVerificationCode(userId: string) {
    // Verifica se o usuário existe
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Gera código de 4 dígitos e calcula expiração
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const expiration = addMinutes(new Date(), 5);

    // Cria o registro no banco com relacionamento
    const data: Prisma.VerificationCodeCreateInput = {
      code,
      user: {
        connect: { id: userId },
      },
      createdAt: new Date(),
      expiresAt: expiration,
      used: false,
    };

    await this.prisma.verificationCode.create({ data });

    // Simula envio de e-mail
    console.log(`🔐 Verification code sent to ${user.email}: ${code}`);

    return { userId: user.id, code: code };
  }


  async verifyCode(dto: VerifyCodeDto) {
    const codeEntry = await this.prisma.verificationCode.findFirst({
      where: {
        userId: dto.userId,
        code: dto.code,
        used: false,
      },
    });

    if (!codeEntry) {
      throw new NotFoundException('Code not found or already used');
    }

    if (isAfter(new Date(), codeEntry.expiresAt)) {
      throw new BadRequestException('Code expired');
    }

    await this.prisma.verificationCode.update({
      where: { id: codeEntry.id },
      data: { used: true },
    });

    const user = await this.prisma.user.findUnique({ where: { id: codeEntry.userId } });

    return { userId: codeEntry.userId };
  }
}
