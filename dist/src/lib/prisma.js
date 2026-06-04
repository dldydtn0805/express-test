import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client.js";
const currentDir = dirname(fileURLToPath(import.meta.url));
const envPaths = [
    join(process.cwd(), ".env"),
    join(currentDir, "../../.env"),
    join(currentDir, "../../../.env"),
];
const envPath = envPaths.find((path) => existsSync(path));
config({ path: envPath });
const requiredEnv = [
    "DATABASE_USER",
    "DATABASE_PASSWORD",
    "DATABASE_NAME",
];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (!process.env.DATABASE_SOCKET && !process.env.DATABASE_HOST) {
    missingEnv.push("DATABASE_HOST");
}
if (missingEnv.length > 0) {
    throw new Error(`Missing database env: ${missingEnv.join(", ")}`);
}
const port = process.env.DATABASE_PORT
    ? Number(process.env.DATABASE_PORT)
    : undefined;
const host = process.env.DATABASE_HOST === "localhost"
    ? "127.0.0.1"
    : process.env.DATABASE_HOST;
const connection = process.env.DATABASE_SOCKET
    ? {
        socketPath: process.env.DATABASE_SOCKET,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        connectionLimit: 5,
    }
    : {
        host,
        port,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        connectionLimit: 5,
    };
const adapter = new PrismaMariaDb(connection);
const prisma = new PrismaClient({ adapter });
export { prisma };
