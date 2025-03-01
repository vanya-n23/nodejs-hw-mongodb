import { initMongoConnection } from './db/initMongoConnection.js';
import { setUpServer } from './server.js';

const bootstrap = async () => {
  await initMongoConnection();
  setUpServer();
};

bootstrap();
