import type { ActiveRelation } from "../model/Relation";
import type { Concept } from "../model/Concept";
import type { ConceptId } from "../model/ConceptId";
import type { Transaction } from "$lib/operation/domain/model/Transaction";

export abstract class GraphRepository {
    protected declare transaction: Transaction;

    constructor(transaction: Transaction) {
        this.transaction = transaction;
    }

    public abstract getConceptById(conceptId: ConceptId): Promise<Concept>;

    public abstract getConceptRelationsById(
        conceptId: ConceptId,
    ): Promise<ActiveRelation[]>;
}
