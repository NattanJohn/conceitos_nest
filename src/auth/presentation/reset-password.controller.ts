// src/auth/presentation/password-reset.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { PasswordResetService } from '../application/reset-password.service';

@Controller('auth')
export class PasswordResetController {
  constructor(private readonly resetService: PasswordResetService) {}

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    return this.resetService.sendResetCode(body.email);
  }

  @Post('reset-password')
  async resetPassword(
    @Body()
    body: {
      email: string;
      code: string;
      newPassword: string;
    },
  ) {
    return this.resetService.resetPassword(body.email, body.code, body.newPassword);
  }
}
