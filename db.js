import { fileURLToPath } from "url";
import { dirname } from "path";
import { resolve } from "path";
import { LowSync, JSONFileSync } from "lowdb";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbDir = resolve(__dirname, "db.json");

export default {
  init(app) {
    const JSONFile = new JSONFileSync(dbDir);

    const db = new LowSync(JSONFile);
    db.read();
    app.db = db;
    console.log("DATABASE IS READY");
  },
};
