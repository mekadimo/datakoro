import { DbGraphManager } from "../../../../graph/infrastructure/prisma/service/DbGraphManager";
import { DbOperation } from "../model/DbOperation";
import { DbOperationConcept } from "../model/DbOperationConcept";
import { DbTransaction } from "../model/DbTransaction";
import { DbTransactionConcept } from "../model/DbTransactionConcept";
import { DomainException } from "$lib/shared/domain/model/DomainException";
import { ID_DATAKORO_OPERATION } from "../../../../graph/domain/model/ConceptId";
import { ID_DATAKORO_TRANSACTION } from "../../../../graph/domain/model/ConceptId";
import { Operation } from "../../../domain/model/Operation";
import { OperationConcept } from "../../../domain/model/OperationConcept";
import { OperationConceptId } from "../../../domain/model/OperationConcept";
import { OperationConceptSqlExecutor } from "../statement/OperationConceptSqlExecutor";
import { OperationService } from "../../../domain/service/OperationService";
import { PRISMA_CLIENT } from "../../../../shared/infrastructure/prisma/model/Prisma";
import { TransactionConcept } from "../../../domain/model/TransactionConcept";
import { TransactionConceptDate } from "../../../domain/model/TransactionConceptDate";
import { TransactionConceptId } from "../../../domain/model/TransactionConcept";
import { TransactionConceptSqlExecutor } from "../statement/TransactionConceptSqlExecutor";
import { UnknownErrorException } from "$lib/shared/domain/model/DomainException";
import { UserNotLoggedInException } from "$lib/shared/domain/model/DomainException";

export class DbOperationService extends OperationService {
    private async addOperationConcept(
        transaction: DbTransaction,
        operationConcept: OperationConcept,
    ): Promise<void> {
        await DbGraphManager.addConcept({
            transaction: transaction,
            conceptId: transaction.concept.operationId,
            abstractionId: ID_DATAKORO_OPERATION,
        });

        const dbOperationConcept =
            DbOperationConcept.fromDomain(operationConcept);
        await OperationConceptSqlExecutor.insert(
            transaction.prismaTx,
            dbOperationConcept,
        );
    }

    private async addTransactionConcept(
        transaction: DbTransaction,
        transactionConcept: TransactionConcept,
    ): Promise<void> {
        await DbGraphManager.addConcept({
            transaction: transaction,
            conceptId: transaction.concept.id,
            abstractionId: ID_DATAKORO_TRANSACTION,
        });

        const dbTransactionConcept =
            DbTransactionConcept.fromDomain(transactionConcept);
        await TransactionConceptSqlExecutor.insert(
            transaction.prismaTx,
            dbTransactionConcept,
        );
    }

    protected async run<T>({
        isReadOnly,
        runFunction,
    }: {
        isReadOnly: boolean;
        runFunction: (operation: Operation) => Promise<T>;
    }): Promise<T> {
        try {
            const result = await PRISMA_CLIENT.$transaction(
                async (prismaTransaction) => {
                    let transaction: DbTransaction;
                    let operation: DbOperation;

                    if (isReadOnly) {
                        transaction = new DbTransaction({
                            transactionConcept: null,
                            userId: this.userId,
                            prismaTx: prismaTransaction,
                        });
                        operation = new DbOperation({
                            operationConcept: null,
                            transaction: transaction,
                            userId: this.userId,
                        });
                    } else {
                        if (null == this.userId) {
                            throw new UserNotLoggedInException();
                        }

                        const operationConceptId =
                            OperationConceptId.generateRandom();
                        const transactionConceptDate =
                            TransactionConceptDate.createCurrent();
                        const transactionConceptId =
                            TransactionConceptId.generateRandom();

                        const operationConcept = OperationConcept.create({
                            conceptId: operationConceptId,
                            userConceptId: this.userId,
                            transactionConceptDate: transactionConceptDate,
                        });
                        const transactionConcept = TransactionConcept.create({
                            conceptId: transactionConceptId,
                            operationConceptId: operationConceptId,
                            transactionConceptDate: transactionConceptDate,
                        });

                        transaction = new DbTransaction({
                            transactionConcept: transactionConcept,
                            userId: this.userId,
                            prismaTx: prismaTransaction,
                        });
                        operation = new DbOperation({
                            operationConcept: operationConcept,
                            transaction: transaction,
                            userId: this.userId,
                        });

                        await this.addOperationConcept(
                            transaction,
                            operationConcept,
                        );
                        await this.addTransactionConcept(
                            transaction,
                            transactionConcept,
                        );
                    }

                    const functionResult = await runFunction(operation);
                    return functionResult;
                },
                {
                    maxWait: 5000, // default: 2000
                    timeout: 10000, // default: 5000
                },
            );
            return result;
        } catch (error) {
            // TODO: Handle the rollback...? Prisma does it automatically,
            // but I'm not sure...

            if (error instanceof DomainException) {
                throw error;
            }

            console.error(error);
            throw new UnknownErrorException();
        }
    }
}
