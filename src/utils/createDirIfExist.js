import fs from 'node:fs/promises';

export const createDirIfExist = async (url) => {
  try {
    await fs.access(url);
  } catch (error) {
    if (error.code === 'ENOENT') {
      fs.mkdir(url);
    }
  }
};
