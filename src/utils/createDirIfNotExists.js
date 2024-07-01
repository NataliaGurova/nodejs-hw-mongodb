
import fs from 'node:fs/promises';

// Перевіряємо чи існує директорія за вказаним шляхом (url)
export const createDirIfNotExists = async (url) => {
  try {
    await fs.access(url);
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.mkdir(url);
    }
  }
};
