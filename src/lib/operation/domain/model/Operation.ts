import type { GraphRepository } from "../../../graph/domain/repository/GraphRepository";
import type { Transaction } from "./Transaction";
import { CurrentTransactionIsReadOnlyException } from "../../../shared/domain/model/DomainException";
import { OperationConcept } from "./OperationConcept";
import { UserConceptId } from "../../../user/domain/model/UserConcept";

export abstract class Operation {
    public readonly _concept: OperationConcept | null;
    public transaction: Transaction;
    public readonly userId: UserConceptId | null;

    constructor(input: {
        operationConcept: OperationConcept | null;
        transaction: Transaction;
        userId: UserConceptId | null;
    }) {
        this.userId = input.userId;
        this._concept = input.operationConcept;
        this.transaction = input.transaction;
    }

    public get concept(): OperationConcept {
        if (null == this._concept) {
            throw new CurrentTransactionIsReadOnlyException();
        }
        return this._concept;
    }

    public abstract get graphRepository(): GraphRepository;
}
