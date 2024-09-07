import { CurrentTransactionIsReadOnlyException } from "./DomainException";
import { OperationConceptId } from "../../../operation/domain/model/OperationConcept";
import { TransactionConceptDate } from "../../../operation/domain/model/TransactionConceptDate";
import { TransactionConceptId } from "../../../operation/domain/model/TransactionConcept";
import { UserConceptId } from "../../../user/domain/model/UserConcept";

export abstract class Transaction {
    private readonly operationConceptId: OperationConceptId | null;
    private readonly transactionConceptDate: TransactionConceptDate | null;
    private readonly transactionConceptId: TransactionConceptId | null;
    private readonly userId: UserConceptId | null;

    constructor({
        operationConceptId,
        transactionConceptDate,
        transactionConceptId,
        userId,
    }: {
        operationConceptId: OperationConceptId | null;
        transactionConceptDate: TransactionConceptDate | null;
        transactionConceptId: TransactionConceptId | null;
        userId: UserConceptId | null;
    }) {
        this.operationConceptId = operationConceptId;
        this.transactionConceptDate = transactionConceptDate;
        this.transactionConceptId = transactionConceptId;
        this.userId = userId;
    }

    public get currentOperationConceptId(): OperationConceptId {
        if (null == this.operationConceptId) {
            throw new CurrentTransactionIsReadOnlyException();
        }
        return this.operationConceptId;
    }

    public get currentTransactionConceptId(): TransactionConceptId {
        if (null == this.transactionConceptId) {
            throw new CurrentTransactionIsReadOnlyException();
        }
        return this.transactionConceptId;
    }

    public get currentTransactionConceptDate(): TransactionConceptDate {
        if (null == this.transactionConceptDate) {
            throw new CurrentTransactionIsReadOnlyException();
        }
        return this.transactionConceptDate;
    }

    public get currentUserId(): UserConceptId {
        if (null == this.userId) {
            throw new CurrentTransactionIsReadOnlyException();
        }
        return this.userId;
    }
}
