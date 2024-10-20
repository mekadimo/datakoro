import type { PrismaTransaction } from "../../../../shared/infrastructure/prisma/model/Prisma";
import { Transaction } from "../../../domain/model/Transaction";
import { TransactionConcept } from "../../../domain/model/TransactionConcept";
import { UserConceptId } from "../../../../user/domain/model/UserConcept";

export class DbTransaction extends Transaction {
    public prismaTx: PrismaTransaction;

    constructor(input: {
        prismaTx: PrismaTransaction;
        transactionConcept: TransactionConcept | null;
        userId: UserConceptId | null;
    }) {
        super({
            transactionConcept: input.transactionConcept,
            userId: input.userId,
        });

        this.prismaTx = input.prismaTx;
    }
}
