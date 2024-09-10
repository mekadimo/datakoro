import type { ActiveRelationSearchCriteria } from "$lib/graph/domain/model/Relation";
import type { Concept } from "../../../domain/model/Concept";
import type { ConceptId } from "../../../domain/model/ConceptId";
import type { DbTransaction } from "../../../../operation/infrastructure/prisma/model/DbTransaction";
import { ActiveRelation } from "$lib/graph/domain/model/Relation";
import { ActiveRelationField } from "$lib/graph/domain/model/Relation";
import { DbGraphManager } from "../service/DbGraphManager";
import { GraphRepository } from "../../../domain/repository/GraphRepository";
import { UuidFilterTypeValue } from "$lib/shared/domain/model/Filter";

export class DbGraphRepository extends GraphRepository {
    protected declare transaction: DbTransaction;

    public async getConceptById(conceptId: ConceptId): Promise<Concept> {
        const concept = await DbGraphManager.getConceptById({
            conceptId: conceptId,
            transaction: this.transaction,
        });
        return concept;
    }

    public async getConceptRelationsById(
        conceptId: ConceptId,
    ): Promise<ActiveRelation[]> {
        const criteria: ActiveRelationSearchCriteria = {
            filters: [
                {
                    field: ActiveRelationField.ConceptId,
                    filter: {
                        type: UuidFilterTypeValue.IsEqualTo,
                        value: conceptId,
                    },
                },
            ],
        };
        const conceptRelations = await DbGraphManager.searchActiveRelations({
            criteria: criteria,
            transaction: this.transaction,
        });
        return conceptRelations;
    }
}
