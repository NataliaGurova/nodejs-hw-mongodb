/*
process.argv   -- аргументи запуску
process.env    -- перелік всіх змінних оточення
process.exit() -- завершення процесу NodeJS
process.cwd()  -- поточна діректорія
*/

import { initMongoConnection } from "./db/initMongoConnection.js";
import { setupServer } from "./server.js";
import { createDirIfNotExists } from "./utils/createDirIfNotExists.js";
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from "./constants/index.js";


const bootstrap = async () => {
  await initMongoConnection();
  await createDirIfNotExists(TEMP_UPLOAD_DIR);
  await createDirIfNotExists(UPLOAD_DIR);
  setupServer();
};

void bootstrap();

