import type { PrismaTransaction } from "../../../../shared/infrastructure/prisma/model/Prisma";
import { Transaction } from "../../../domain/model/Transaction";
import { TransactionConcept } from "../../../domain/model/TransactionConcept";
import { UserConceptId } from "../../../../user/domain/model/UserConcept";

export class DbTransaction extends Transaction {
    public prismaTx: PrismaTransaction;

    constructor({
        prismaTx,
        transactionConcept,
        userId,
    }: {
        prismaTx: PrismaTransaction;
        transactionConcept: TransactionConcept | null;
        userId: UserConceptId | null;
    }) {
        super({
            transactionConcept: transactionConcept,
            userId: userId,
        });

        this.prismaTx = prismaTx;
    }
}
