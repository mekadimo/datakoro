import type { Transaction } from "../model/Transaction";
import type { UserConceptId } from "../../../user/domain/model/UserConcept";

export abstract class TransactionService {
    public abstract runTransaction<T>(
        transactionFunction: (transaction: Transaction) => T,
    ): Promise<T>;

    public abstract runTransactionForOperation<T>(
        userId: UserConceptId,
        transactionFunction: (transaction: Transaction) => T,
    ): Promise<T>;
}
