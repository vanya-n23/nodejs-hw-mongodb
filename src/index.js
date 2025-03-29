import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';
import { createSession } from './utils/createSession.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';

const startApp = async () => {
  try {
    await initMongoConnection();
    await createSession(TEMP_UPLOAD_DIR);
    await createSession(UPLOAD_DIR);

    setupServer();
  } catch (error) {
    console.error('Critical error during app startup:', error);
    process.exit(1);
  }
};

startApp();
