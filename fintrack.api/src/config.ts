import { config } from "dotenv";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let envPath = resolve(__dirname, `../env/${process.env.NODE_ENV}.env`);

config({ path: envPath });

export const NODE_ENV = process.env.NODE_ENV || "development";
