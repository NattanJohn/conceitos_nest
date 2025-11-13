import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './application/auth.service';
import { AuthController } from './presentation/auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordReset } from './domain/entities/password-reset.entity';
import { User } from 'src/users/infrastructure/entities/user.entity';
import { MailModule } from 'src/mail/mail.module';
import { PasswordResetController } from './presentation/reset-password.controller';
import { PasswordResetService } from './application/reset-password.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    MailModule,
    TypeOrmModule.forFeature([PasswordReset, User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => {
        const secret = config.get<string>('JWT_SECRET') ?? 'default_secret';
        const expiresIn = config.get<string>('JWT_EXPIRES_IN') ?? '1d';

        return {
          secret,
          signOptions: {
            expiresIn: expiresIn as JwtSignOptions['expiresIn'],
          },
        };
      },
    }),
  ],
  controllers: [AuthController, PasswordResetController],
  providers: [AuthService, JwtStrategy, PasswordResetService],
  exports: [AuthService, PassportModule],
})
export class AuthModule {}
