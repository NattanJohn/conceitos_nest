import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PasswordReset } from '../domain/entities/password-reset.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { MailService } from '../../mail/application/mail.service';
import { User } from 'src/users/infrastructure/entities/user.entity';

@Injectable()
export class PasswordResetService {
  constructor(
    @InjectRepository(PasswordReset)
    private readonly resetRepo: Repository<PasswordReset>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly mailService: MailService,
  ) {}

  async sendResetCode(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.resetRepo.delete({ user_id: user.id });

    const reset = this.resetRepo.create({
      code,
      user_id: user.id,
      expiresAt,
    });

    await this.resetRepo.save(reset);

    // ✅ agora chamamos o método que já envia com o resetLink
    await this.mailService.sendPasswordResetMail(user.email, user.name, code);

    return { message: 'Código enviado para o e-mail.' };
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    const reset = await this.resetRepo.findOne({
      where: { user_id: user.id, code },
    });
    if (!reset) throw new BadRequestException('Código inválido.');

    if (reset.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException('Código expirado.');
    }

    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    await this.userRepo.save(user);

    await this.resetRepo.delete({ id: reset.id });

    return { message: 'Senha atualizada com sucesso.' };
  }
}
