import type { ActiveRelationSearchCriteria } from "$lib/graph/domain/model/Relation";
import type { Concept } from "../../../domain/model/Concept";
import type { DbTransaction } from "../../../../operation/infrastructure/prisma/model/DbTransaction";
import { ActiveRelation } from "$lib/graph/domain/model/Relation";
import { ActiveRelationField } from "$lib/graph/domain/model/Relation";
import { ConceptId } from "../../../domain/model/ConceptId";
import { ConceptName } from "../../../domain/model/ConceptName";
import { ConceptNameText } from "../../../domain/model/ConceptName";
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

    // TODO: This is temporal; remove raw Prisma use once it's not needed
    public async getConceptIdsBySearch(
        queryText: string,
        languageId: ConceptId,
    ): Promise<ConceptId[]> {
        const results =
            await this.transaction.prismaTx.temp_concept_name.findMany({
                where: {
                    concept_id_language: { equals: languageId.longValue },
                    text_value: { contains: queryText, mode: "insensitive" },
                },
            });
        const conceptIds = results.map(
            (r) => new ConceptId(r.concept_id_concept),
        );
        return conceptIds;
    }

    public async getConceptNamesWithPreferredLanguage(
        conceptIds: ConceptId[],
        languageId: ConceptId,
    ): Promise<{ [conceptIdShortValue: string]: ConceptName }> {
        // TODO: This is temporal; remove raw Prisma use once it's not needed
        const conceptNames: { [conceptIdShortValue: string]: ConceptName } = {};
        const results =
            await this.transaction.prismaTx.temp_concept_name.findMany({
                where: {
                    concept_id_language: { equals: languageId.longValue },
                    concept_id_concept: {
                        in: conceptIds.map((v) => v.longValue),
                    },
                },
            });
        for (const result of results) {
            const conceptId = new ConceptId(result.concept_id_concept);
            conceptNames[conceptId.shortValue] = new ConceptName({
                languageId: new ConceptId(result.concept_id_language),
                text: new ConceptNameText(result.text_value),
            });
        }
        return conceptNames;
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
