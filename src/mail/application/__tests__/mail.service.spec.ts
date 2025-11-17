/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';
import { MailService } from '../mail.service';

describe('MailService', () => {
  let service: MailService;

  // Mock tipado corretamente
  const mockMailerService: Pick<MailerService, 'sendMail'> = {
    sendMail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: MailerService,
          useValue: mockMailerService,
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send password reset mail', async () => {
    (mockMailerService.sendMail as jest.Mock).mockResolvedValueOnce(undefined);

    await service.sendPasswordResetMail('test@email.com', 'Nattan', '123456');

    expect(mockMailerService.sendMail).toHaveBeenCalledTimes(1);

    expect(mockMailerService.sendMail).toHaveBeenCalledWith({
      to: 'test@email.com',
      subject: 'Recuperação de Senha - Plataforma',
      template: './reset-password',
      context: {
        name: 'Nattan',
        code: '123456',
        resetLink: expect.stringContaining('reset-password?email=test@email.com&code=123456'),
        year: expect.any(Number),
      },
    });
  });
});
