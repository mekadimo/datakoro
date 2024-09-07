import type { DefaultArgs } from "@prisma/client/runtime/library";
import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

export type PrismaTransaction = Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

export const PRISMA_CLIENT = new PrismaClient();
