// src/common/multer.options.ts
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MulterModuleOptions } from '@nestjs/platform-express';

export const multerOptions: MulterModuleOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (
      _req,
      file: Express.Multer.File, // ← 타입 명시
      callback: (error: Error | null, filename: string) => void,
    ) => {
      const uniqueSuffix = Date.now() + extname(file.originalname);
      callback(null, `${file.fieldname}-${uniqueSuffix}`);
    },
  }),
};
