
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestCodeDto } from './dto/request-code.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('token')
  getToken(@Body() body: any) {
    const token = this.authService.generateToken({ sub: 'anonymous' });
    return { token };
  }

  @Post('create-code')
  async requestCode(@Body() body: any) {
    console.log(body)
    return this.authService.createVerificationCode(body.userId);
  }

  @Post('verify-code')
  async verifyCode(@Body() body: any) {
    return this.authService.verifyCode({ userId: body.userId, code: body.code });
  }
}
