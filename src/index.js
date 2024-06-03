/*
process.argv   -- аргументи запуску
process.env    -- перелік всіх змінних оточення
process.exit() -- завершення процесу NodeJS
process.cwd()  -- поточна діректорія
*/

import { initMongoConnection } from "./db/initMongoConnection.js";
import { setupServer } from "./server.js";

const bootstrap = async () => {
  await initMongoConnection();
  setupServer();
};

bootstrap();

