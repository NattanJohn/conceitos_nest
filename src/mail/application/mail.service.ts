import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  /**
   * Envia e-mail específico de recuperação de senha
   * (template reset-password.hbs)
   */
  async sendPasswordResetMail(email: string, name: string, code: string): Promise<void> {
    const resetLink = `http://localhost:5173/reset-password?email=${email}&code=${code}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Recuperação de Senha - Plataforma',
      template: './reset-password',
      context: {
        name,
        code,
        resetLink,
        year: new Date().getFullYear(),
      },
    });
  }
}
