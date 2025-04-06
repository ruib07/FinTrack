import { config } from "dotenv";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = resolve(__dirname, `./env/${process.env.NODE_ENV}.env`);

config({ path: envPath });

const settings = {
  client: "pg",
  connection: {
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
  debug: false,
  migrations: {
    directory: "src/migrations",
    extension: "ts",
  },
  pool: {
    min: 0,
    max: 50,
    propagateCreateError: false,
  },
};

export default {
  development: settings,
};
