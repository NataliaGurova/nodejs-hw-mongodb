//зберігає зображення в постійну папку, а також видаляє її з тимчасової
import path from 'node:path';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from '../constants/index.js';
import fs from 'node:fs/promises';
import { env } from './env.js';


export const saveFileToUploadDir = async (file) => {
  await fs.rename(
    path.join(TEMP_UPLOAD_DIR, file.filename),
    path.join(UPLOAD_DIR, file.filename),
  );

  return `http://${env('APP_DOMAIN')}/uploads/${file.filename}`;
};
