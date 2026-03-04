import { DataSource } from "typeorm";
import { Child } from "../entities/Child";
import { Group } from "../entities/Group";
import { Planning } from "../entities/Planning";
import { Report } from "../entities/Report";
import { User } from "../entities/User";
import env from "../env";

const db = new DataSource({
  type: "postgres",
  host: env.DB_HOST,
  username: env.DB_USER,
  password: env.DB_PASS,
  port: env.NODE_ENV === "test" ? env.TEST_DB_PORT : env.DB_PORT,
  database: env.DB_NAME,
  entities: [User, Child, Group, Planning, Report],
  migrations: [`${__dirname}/migrations/**/*{.js,.ts}`],
  migrationsRun: true,
  // synchronize: env.NODE_ENV !== "production",
  //logging: true,
});

export async function clearDB() {
  const runner = db.createQueryRunner();
  const tableDroppings = db.entityMetadatas.map((entity) =>
    runner.query(`DROP TABLE IF EXISTS "${entity.tableName}" CASCADE`),
  );
  await Promise.all(tableDroppings);
  await runner.release();
  await db.synchronize();
}

export default db;
