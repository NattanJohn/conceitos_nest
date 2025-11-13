import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from '../application/mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('test-reset')
  async testReset(@Body() body: { to: string; name?: string }) {
    const name = body.name || 'Usuário';
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await this.mailService.sendPasswordResetMail(body.to, name, code);

    return { ok: true, message: 'E-mail de recuperação enviado com sucesso.' };
  }
}
