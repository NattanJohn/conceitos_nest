import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import type { Request } from 'express';

const UPLOAD_DIR = join(process.cwd(), 'uploads', 'courses');

export function courseMulterOptions(): MulterOptions {
  if (!existsSync(UPLOAD_DIR)) {
    mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  return {
    storage: diskStorage({
      destination: UPLOAD_DIR,
      filename: (
        req: Request & { params: { id?: string } },
        file: Express.Multer.File,
        cb: (error: Error | null, filename: string) => void,
      ) => {
        try {
          const ext = extname(file.originalname).toLowerCase();
          const courseId = req.params?.id;
          const fileName = courseId ? `${courseId}${ext}` : `${Date.now()}${ext}`;
          cb(null, fileName);
        } catch (error) {
          cb(error instanceof Error ? error : new Error('Erro ao gerar nome do arquivo'), '');
        }
      },
    }),
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (
      req: Request & { params: { id?: string } },
      file: Express.Multer.File,
      cb: (error: Error | null, acceptFile: boolean) => void,
    ) => {
      const allowed = ['.png', '.jpg', '.jpeg', '.webp'];
      const ext = extname(file.originalname).toLowerCase();
      if (!allowed.includes(ext)) {
        return cb(new Error('Tipo de arquivo inválido. Use png/jpg/jpeg/webp'), false);
      }
      cb(null, true);
    },
  };
}
