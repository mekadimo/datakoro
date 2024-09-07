import type { UserConceptId } from "../../../../user/domain/model/UserConcept";
import { DbOperationConceptManager } from "../../../../operation/infrastructure/prisma/service/DbOperationConceptManager";
import { DbTransaction } from "../model/DbTransaction";
import { DbTransactionConceptManager } from "../../../../operation/infrastructure/prisma/service/DbTransactionConceptManager";
import { OperationConceptId } from "../../../../operation/domain/model/OperationConcept";
import { PRISMA_CLIENT } from "../model/Prisma";
import { Transaction } from "../../../domain/model/Transaction";
import { TransactionConceptDate } from "../../../../operation/domain/model/TransactionConceptDate";
import { TransactionConceptId } from "../../../../operation/domain/model/TransactionConcept";
import { TransactionService } from "../../../domain/service/TransactionService";

export class DbTransactionService extends TransactionService {
    public async runTransaction<T>(
        transactionFunction: (transaction: Transaction) => T,
    ): Promise<T> {
        try {
            const result = await PRISMA_CLIENT.$transaction(
                async (prismaTransaction) => {
                    const dbTransaction = new DbTransaction({
                        operationConceptId: null,
                        transactionConceptDate: null,
                        transactionConceptId: null,
                        userId: null,
                        prismaTx: prismaTransaction,
                    });
                    const functionResult =
                        await transactionFunction(dbTransaction);
                    return functionResult;
                },
                {
                    maxWait: 5000, // default: 2000
                    timeout: 10000, // default: 5000
                },
            );
            return result;
        } catch (err) {
            // TODO: Handle the rollback...
            // If DomainException, throw it.
            // Else, DomainException Unknown Database error.
            console.log(err);
            throw err;
        }
    }

    public async runTransactionForOperation<T>(
        userId: UserConceptId,
        transactionFunction: (transaction: Transaction) => T,
    ): Promise<T> {
        try {
            const result = await PRISMA_CLIENT.$transaction(
                async (prismaTransaction) => {
                    const operationConceptId =
                        OperationConceptId.generateRandom();
                    const transactionConceptDate =
                        TransactionConceptDate.createCurrent();
                    const transactionConceptId =
                        TransactionConceptId.generateRandom();

                    const dbTransaction = new DbTransaction({
                        operationConceptId: operationConceptId,
                        transactionConceptDate: transactionConceptDate,
                        transactionConceptId: transactionConceptId,
                        userId: userId,
                        prismaTx: prismaTransaction,
                    });

                    await DbOperationConceptManager.addOperationConcept({
                        transaction: dbTransaction,
                    });
                    await DbTransactionConceptManager.addTransactionConcept({
                        transaction: dbTransaction,
                    });

                    const functionResult =
                        await transactionFunction(dbTransaction);
                    return functionResult;
                },
                {
                    maxWait: 5000, // default: 2000
                    timeout: 10000, // default: 5000
                },
            );
            return result;
        } catch (err) {
            // TODO: Handle the rollback...
            // If DomainException, throw it.
            // Else, DomainException Unknown Database error.
            console.log(err);
            throw err;
        }
    }
}
