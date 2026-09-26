import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * One PrismaClient per serverless isolate. On Vercel, Node isolates are reused
 * across invocations — constructing a client per request exhausts Postgres
 * (especially behind PgBouncer / Neon pooler).
 *
 * DATABASE_URL must be the pooled URL (sslmode=require, pgbouncer=true,
 * connection_limit=1). Migrations use DIRECT_URL (non-pooling).
 * Never set statement_timeout in Prisma connect_args — PgBouncer rejects it.
 */
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

globalForPrisma.prisma = prisma;
