import { CurrentTransactionIsReadOnlyException } from "../../../shared/domain/model/DomainException";
import { TransactionConcept } from "./TransactionConcept";
import { UserConceptId } from "../../../user/domain/model/UserConcept";

export abstract class Transaction {
    private readonly _concept: TransactionConcept | null;
    public readonly userId: UserConceptId | null;

    constructor(input: {
        transactionConcept: TransactionConcept | null;
        userId: UserConceptId | null;
    }) {
        this._concept = input.transactionConcept;
        this.userId = input.userId;
    }

    public get concept(): TransactionConcept {
        if (null == this._concept) {
            throw new CurrentTransactionIsReadOnlyException();
        }
        return this._concept;
    }
}
