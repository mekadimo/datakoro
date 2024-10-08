import type { ActiveRelation } from "../model/Relation";
import type { Concept } from "../model/Concept";
import type { ConceptId } from "../model/ConceptId";
import type { Transaction } from "$lib/operation/domain/model/Transaction";
import type { ConceptName } from "../model/ConceptName";

export abstract class GraphRepository {
    protected declare transaction: Transaction;

    constructor(transaction: Transaction) {
        this.transaction = transaction;
    }

    public abstract getConceptById(conceptId: ConceptId): Promise<Concept>;

    // TODO: This is temporal; remove raw Prisma use once it's not needed
    public abstract getConceptIdsBySearch(
        queryText: string,
        languageId: ConceptId,
    ): Promise<ConceptId[]>;

    public abstract getConceptNamesWithPreferredLanguage(
        conceptIds: ConceptId[],
        languageId: ConceptId,
    ): Promise<{ [conceptIdShortValue: string]: ConceptName }>;

    public abstract getConceptRelationsById(
        conceptId: ConceptId,
    ): Promise<ActiveRelation[]>;
}
