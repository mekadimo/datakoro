import type { PrismaTransaction } from "../../../../shared/infrastructure/prisma/model/Prisma";
import { OperationConceptId } from "../../../../operation/domain/model/OperationConcept";
import { Transaction } from "../../../domain/model/Transaction";
import { TransactionConceptDate } from "../../../../operation/domain/model/TransactionConceptDate";
import { TransactionConceptId } from "../../../../operation/domain/model/TransactionConcept";
import { UserConceptId } from "../../../../user/domain/model/UserConcept";

export class DbTransaction extends Transaction {
    prismaTx: PrismaTransaction;

    constructor({
        operationConceptId,
        prismaTx,
        transactionConceptDate,
        transactionConceptId,
        userId,
    }: {
        operationConceptId: OperationConceptId | null;
        prismaTx: PrismaTransaction;
        transactionConceptDate: TransactionConceptDate | null;
        transactionConceptId: TransactionConceptId | null;
        userId: UserConceptId | null;
    }) {
        super({
            operationConceptId: operationConceptId,
            transactionConceptDate: transactionConceptDate,
            transactionConceptId: transactionConceptId,
            userId: userId,
        });

        this.prismaTx = prismaTx;
    }
}
