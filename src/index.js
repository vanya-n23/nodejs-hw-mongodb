import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import setUpServer from './server.js';
import { createDirIfExist } from './utils/createDirIfExist.js';

export const boostrap = async () => {
  await initMongoConnection();
  await createDirIfExist(TEMP_UPLOAD_DIR);
  await createDirIfExist(UPLOAD_DIR);
  setUpServer();
};

boostrap();
