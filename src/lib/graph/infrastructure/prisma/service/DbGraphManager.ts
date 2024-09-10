import type { ActiveRelationFilter } from "../../../domain/model/Relation";
import type { ActiveRelationSearchCriteria } from "../../../domain/model/Relation";
import type { ConceptSearchCriteria } from "../../../domain/model/Concept";
import type { DbTransaction } from "../../../../operation/infrastructure/prisma/model/DbTransaction";
import { ActiveRelation } from "../../../domain/model/Relation";
import { ActiveRelationField } from "../../../domain/model/Relation";
import { ActiveRelationSqlExecutor } from "../statement/ActiveRelationSqlExecutor";
import { Concept } from "../../../domain/model/Concept";
import { ConceptField } from "../../../domain/model/Concept";
import { ConceptHasNotAbstractionException } from "../../../../shared/domain/model/DomainException";
import { ConceptHasNotRelationException } from "../../../../shared/domain/model/DomainException";
import { ConceptId } from "../../../domain/model/ConceptId";
import { ConceptNotFoundException } from "../../../../shared/domain/model/DomainException";
import { ConceptSqlExecutor } from "../statement/ConceptSqlExecutor";
import { DbConcept } from "../model/DbConcept";
import { DbRawRelation } from "../model/DbRawRelation";
import { ID_ABSTRACTION } from "../../../domain/model/ConceptId";
import { ID_CONCEPT } from "../../../domain/model/ConceptId";
import { IntegerNumberFilterType } from "../../../../shared/domain/model/Filter";
import { RawRelation } from "../../../domain/model/Relation";
import { RawRelationSqlExecutor } from "../statement/RawRelationSqlExecutor";
import { RelationOrderNumber } from "../../../domain/model/Relation";
import { UuidFilterTypeList } from "../../../../shared/domain/model/Filter";
import { UuidFilterTypeValue } from "../../../../shared/domain/model/Filter";

export class DbGraphManager {
    public static async addAbstractionRelation({
        abstractionId,
        conceptId,
        transaction,
    }: {
        abstractionId: ConceptId;
        conceptId: ConceptId;
        transaction: DbTransaction;
    }): Promise<ActiveRelation> {
        const relation = await DbGraphManager.addRelation({
            conceptId: conceptId,
            abstractionId: ID_ABSTRACTION,
            propertyId: ID_ABSTRACTION,
            orderNumber: null,
            qualityId: abstractionId,
            qualityTypeId: ID_CONCEPT,
            transaction: transaction,
        });
        return relation;
    }

    public static async addConcept({
        transaction,
        conceptId,
        abstractionId,
    }: {
        transaction: DbTransaction;
        conceptId?: ConceptId;
        abstractionId: ConceptId;
    }): Promise<Concept> {
        const concept = Concept.create({
            conceptId:
                undefined == conceptId ? ConceptId.generateRandom() : conceptId,
            operationConceptId: transaction.concept.operationId,
            transactionConceptId: transaction.concept.id,
            transactionConceptDate: transaction.concept.date,
        });
        const dbConcept = DbConcept.fromDomain(concept);
        await ConceptSqlExecutor.insert(transaction.prismaTx, dbConcept);

        const rawSelfAbstractionRelation = RawRelation.create({
            operationConceptId: transaction.concept.operationId,
            transactionConceptId: transaction.concept.id,
            transactionConceptDate: transaction.concept.date,
            inputConceptId: concept.id,
            inputAbstractionId: ID_ABSTRACTION,
            inputPropertyId: ID_ABSTRACTION,
            inputOrderNumber: null,
            inputQualityId: concept.id,
            inputQualityTypeId: ID_CONCEPT,
        });
        const dbSelfAbstractionRelation = DbRawRelation.fromDomain(
            rawSelfAbstractionRelation,
        );
        await RawRelationSqlExecutor.insert(
            transaction.prismaTx,
            dbSelfAbstractionRelation,
        );
        await DbGraphManager.addAbstractionRelation({
            transaction: transaction,
            conceptId: concept.id,
            abstractionId: abstractionId,
        });

        return concept;
    }

    public static async addRelation({
        conceptId,
        abstractionId,
        propertyId,
        orderNumber,
        qualityId,
        qualityTypeId,
        transaction,
    }: {
        conceptId: ConceptId;
        abstractionId: ConceptId;
        propertyId: ConceptId;
        orderNumber: RelationOrderNumber | null;
        qualityId: ConceptId;
        qualityTypeId: ConceptId;
        transaction: DbTransaction;
    }): Promise<ActiveRelation> {
        const rawRelation = RawRelation.create({
            operationConceptId: transaction.concept.operationId,
            transactionConceptId: transaction.concept.id,
            transactionConceptDate: transaction.concept.date,
            inputConceptId: conceptId,
            inputAbstractionId: abstractionId,
            inputPropertyId: propertyId,
            inputOrderNumber: orderNumber,
            inputQualityId: qualityId,
            inputQualityTypeId: qualityTypeId,
        });
        await DbGraphManager.assertNewRelationIsValid({
            rawRelation: rawRelation,
            transaction: transaction,
        });

        const dbRawRelation = DbRawRelation.fromDomain(rawRelation);
        await RawRelationSqlExecutor.insert(
            transaction.prismaTx,
            dbRawRelation,
        );
        if (rawRelation.isAbstraction) {
            await DbGraphManager.inheritRelations({
                conceptId: conceptId,
                abstractionId: abstractionId,
                transaction: transaction,
            });
        }

        // TODO: Add task to inheritance system

        const relation = ActiveRelation.fromRaw(rawRelation);
        return relation;
    }

    public static async assertConceptHasActiveAbstraction({
        abstractionId,
        conceptId,
        transaction,
    }: {
        abstractionId: ConceptId;
        conceptId: ConceptId;
        transaction: DbTransaction;
    }): Promise<void> {
        const hasActiveAbstraction =
            await DbGraphManager.conceptHasActiveAbstraction({
                abstractionId: abstractionId,
                conceptId: conceptId,
                transaction: transaction,
            });
        if (!hasActiveAbstraction) {
            throw new ConceptHasNotAbstractionException({
                abstractionId: abstractionId.shortValue,
                conceptId: conceptId.shortValue,
            });
        }
    }

    public static async assertConceptHasActiveRelation({
        abstractionId,
        conceptId,
        orderNumber,
        propertyId,
        qualityId,
        transaction,
    }: {
        abstractionId: ConceptId;
        conceptId: ConceptId;
        orderNumber: RelationOrderNumber | null;
        propertyId: ConceptId;
        qualityId: ConceptId;
        transaction: DbTransaction;
    }): Promise<void> {
        const hasActiveRelation = await DbGraphManager.conceptHasActiveRelation(
            {
                abstractionId: abstractionId,
                conceptId: conceptId,
                orderNumber: orderNumber,
                propertyId: propertyId,
                qualityId: qualityId,
                transaction: transaction,
            },
        );
        if (!hasActiveRelation) {
            throw new ConceptHasNotRelationException({
                conceptId: conceptId.shortValue,
                abstractionId: abstractionId.shortValue,
                orderNumber: orderNumber?.value ?? null,
                propertyId: propertyId.shortValue,
                qualityId: qualityId.shortValue,
            });
        }
    }

    public static async assertConceptIsActive({
        conceptId,
        transaction,
    }: {
        conceptId: ConceptId;
        transaction: DbTransaction;
    }): Promise<void> {
        const isActive = await DbGraphManager.conceptIsActive({
            conceptId: conceptId,
            transaction: transaction,
        });
        if (!isActive) {
            throw new ConceptNotFoundException({ id: conceptId.shortValue });
        }
    }

    public static async assertConceptsAreActive({
        conceptIds,
        transaction,
    }: {
        conceptIds: ConceptId[];
        transaction: DbTransaction;
    }): Promise<void> {
        const haveActiveAbstraction =
            await DbGraphManager.conceptsHaveActiveAbstraction({
                abstractionId: ID_CONCEPT,
                conceptIds: conceptIds,
                transaction: transaction,
            });
        if (!haveActiveAbstraction) {
            const exceptions = conceptIds.map((id) => {
                // TODO: Filter only the ones that couldn't be found
                return new ConceptNotFoundException({ id: id.shortValue });
            });
            throw exceptions;
        }
    }

    public static async assertNewRelationIsValid({
        rawRelation,
        transaction,
    }: {
        rawRelation: RawRelation;
        transaction: DbTransaction;
    }): Promise<void> {
        if (rawRelation.isAbstraction) {
            await DbGraphManager.assertConceptIsActive({
                conceptId: rawRelation.conceptId,
                transaction: transaction,
            });
            await DbGraphManager.assertConceptIsActive({
                conceptId: rawRelation.qualityId,
                transaction: transaction,
            });
            // TODO: Check relations can be inherited for concepts and all concretions
        } else {
            await DbGraphManager.assertConceptHasActiveAbstraction({
                conceptId: rawRelation.conceptId,
                abstractionId: rawRelation.abstractionId,
                transaction: transaction,
            });
            await DbGraphManager.assertConceptHasActiveAbstraction({
                conceptId: rawRelation.qualityId,
                abstractionId: rawRelation.propertyId,
                transaction: transaction,
            });
        }
        // TODO: Check relation rules
        // TODO: If quality has an interval, check intersection of all is not empty
        //       (only relation number rule and magnitude)
        // TODO: Ensure all validations!
    }

    public static async conceptHasActiveAbstraction({
        abstractionId,
        conceptId,
        transaction,
    }: {
        abstractionId: ConceptId;
        conceptId: ConceptId;
        transaction: DbTransaction;
    }): Promise<boolean> {
        const exists = await DbGraphManager.conceptHasActiveRelation({
            abstractionId: ID_ABSTRACTION,
            conceptId: conceptId,
            orderNumber: null,
            propertyId: ID_ABSTRACTION,
            qualityId: abstractionId,
            transaction: transaction,
        });
        return exists;
    }

    public static async conceptHasActiveRelation({
        abstractionId,
        conceptId,
        orderNumber,
        propertyId,
        qualityId,
        transaction,
    }: {
        abstractionId: ConceptId;
        conceptId: ConceptId;
        orderNumber: RelationOrderNumber | null;
        propertyId: ConceptId;
        qualityId: ConceptId;
        transaction: DbTransaction;
    }): Promise<boolean> {
        const filters: ActiveRelationFilter[] = [
            {
                field: ActiveRelationField.ConceptId,
                filter: {
                    type: UuidFilterTypeValue.IsEqualTo,
                    value: conceptId,
                },
            },
            {
                field: ActiveRelationField.AbstractionId,
                filter: {
                    type: UuidFilterTypeValue.IsEqualTo,
                    value: abstractionId,
                },
            },
            {
                field: ActiveRelationField.PropertyId,
                filter: {
                    type: UuidFilterTypeValue.IsEqualTo,
                    value: propertyId,
                },
            },
            {
                field: ActiveRelationField.QualityId,
                filter: {
                    type: UuidFilterTypeValue.IsEqualTo,
                    value: qualityId,
                },
            },
        ];
        if (null != orderNumber) {
            filters.push({
                field: ActiveRelationField.OrderNumber,
                filter: {
                    type: IntegerNumberFilterType.IsEqualTo,
                    value: orderNumber.value,
                },
            });
        }
        const exists = await ActiveRelationSqlExecutor.selectExists(
            transaction.prismaTx,
            filters,
        );
        return exists;
    }

    public static async conceptIsActive({
        conceptId,
        transaction,
    }: {
        conceptId: ConceptId;
        transaction: DbTransaction;
    }): Promise<boolean> {
        const exists = await DbGraphManager.conceptHasActiveAbstraction({
            abstractionId: ID_CONCEPT,
            conceptId: conceptId,
            transaction: transaction,
        });
        return exists;
    }

    public static async conceptsAreActive({
        conceptIds,
        transaction,
    }: {
        conceptIds: ConceptId[];
        transaction: DbTransaction;
    }): Promise<boolean> {
        const exist = await DbGraphManager.conceptsHaveActiveAbstraction({
            abstractionId: ID_CONCEPT,
            conceptIds: conceptIds,
            transaction: transaction,
        });
        return exist;
    }

    public static async conceptsHaveActiveAbstraction({
        abstractionId,
        conceptIds,
        transaction,
    }: {
        abstractionId: ConceptId;
        conceptIds: ConceptId[];
        transaction: DbTransaction;
    }): Promise<boolean> {
        const exist = await DbGraphManager.conceptsHaveActiveRelation({
            conceptIds: conceptIds,
            abstractionId: ID_ABSTRACTION,
            propertyId: ID_ABSTRACTION,
            orderNumber: null,
            qualityId: abstractionId,
            transaction: transaction,
        });
        return exist;
    }

    public static async conceptsHaveActiveRelation({
        abstractionId,
        conceptIds,
        orderNumber,
        propertyId,
        qualityId,
        transaction,
    }: {
        abstractionId: ConceptId;
        conceptIds: ConceptId[];
        orderNumber: RelationOrderNumber | null;
        propertyId: ConceptId;
        qualityId: ConceptId;
        transaction: DbTransaction;
    }): Promise<boolean> {
        // TODO: Instead of running a query for every concept ID,
        // check everything in a single query.
        for (const conceptId of conceptIds) {
            const exist = await DbGraphManager.conceptHasActiveRelation({
                conceptId: conceptId,
                abstractionId: abstractionId,
                propertyId: propertyId,
                orderNumber: orderNumber,
                qualityId: qualityId,
                transaction: transaction,
            });
            if (!exist) {
                return false;
            }
        }
        return true;
    }

    public static async findConceptById({
        conceptId,
        transaction,
    }: {
        conceptId: ConceptId;
        transaction: DbTransaction;
    }): Promise<Concept | null> {
        const conceptIsActive = await DbGraphManager.conceptIsActive({
            conceptId: conceptId,
            transaction: transaction,
        });
        if (!conceptIsActive) {
            return null;
        }
        const criteria: ConceptSearchCriteria = {
            filters: [
                {
                    field: ConceptField.Id,
                    filter: {
                        type: UuidFilterTypeValue.IsEqualTo,
                        value: conceptId,
                    },
                },
            ],
        };
        const dbConcepts = await ConceptSqlExecutor.select(
            transaction.prismaTx,
            criteria,
        );
        if (0 === dbConcepts.length) {
            return null;
        }
        const dbConcept = dbConcepts[0];
        const concept = dbConcept.toDomain();
        return concept;
    }

    public static async findConceptsByIdInBulk({
        conceptIds,
        transaction,
    }: {
        conceptIds: ConceptId[];
        transaction: DbTransaction;
    }): Promise<Concept[]> {
        // TODO: Instead of running a query for every concept ID,
        // find all in a single query (a JOIN would be necessary in order
        // to check if it has any relations).
        const concepts: Concept[] = [];
        for (const conceptId of conceptIds) {
            const concept = await DbGraphManager.findConceptById({
                conceptId: conceptId,
                transaction: transaction,
            });
            if (null == concept) {
                continue;
            }
            concepts.push(concept);
        }
        return concepts;
    }

    public static async getConceptById({
        conceptId,
        transaction,
    }: {
        conceptId: ConceptId;
        transaction: DbTransaction;
    }): Promise<Concept> {
        const concept = await DbGraphManager.findConceptById({
            conceptId: conceptId,
            transaction: transaction,
        });

        if (null == concept) {
            throw new ConceptNotFoundException({ id: conceptId.shortValue });
        }

        return concept;
    }

    public static async getConceptsByIdInBulk({
        conceptIds,
        transaction,
    }: {
        conceptIds: ConceptId[];
        transaction: DbTransaction;
    }): Promise<Concept[]> {
        const concepts = await DbGraphManager.findConceptsByIdInBulk({
            conceptIds: conceptIds,
            transaction: transaction,
        });

        if (conceptIds.length !== concepts.length) {
            const exceptions = [];
            const foundConceptIdShortValues = concepts.map(
                (c) => c.id.shortValue,
            );
            for (const conceptId of conceptIds) {
                if (foundConceptIdShortValues.includes(conceptId.shortValue)) {
                    continue;
                }
                const exception = new ConceptNotFoundException({
                    id: conceptId.shortValue,
                });
                exceptions.push(exception);
            }
            throw exceptions;
        }

        return concepts;
    }

    public static async inheritRelations({
        conceptId,
        abstractionId,
        transaction,
    }: {
        conceptId: ConceptId;
        abstractionId: ConceptId;
        transaction: DbTransaction;
    }): Promise<void> {
        const conceptCriteria: ActiveRelationSearchCriteria = {
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
        const relationsOfConcept = await DbGraphManager.searchActiveRelations({
            criteria: conceptCriteria,
            transaction: transaction,
        });
        const sourceRelationIdsOfConcept = relationsOfConcept.map(
            (r) => r.sourceRelationId,
        );

        const abstractionCriteria: ActiveRelationSearchCriteria = {
            filters: [
                {
                    field: ActiveRelationField.ConceptId,
                    filter: {
                        type: UuidFilterTypeValue.IsEqualTo,
                        value: abstractionId,
                    },
                },
                {
                    field: ActiveRelationField.SourceRelationId,
                    filter: {
                        type: UuidFilterTypeList.IsNotIn,
                        value: sourceRelationIdsOfConcept,
                    },
                },
            ],
        };
        const relationsOfAbstraction =
            await DbGraphManager.searchActiveRelations({
                transaction: transaction,
                criteria: abstractionCriteria,
            });

        const rawRelations = relationsOfAbstraction.map((r) =>
            RawRelation.createInherited({
                operationConceptId: transaction.concept.operationId,
                transactionConceptId: transaction.concept.id,
                transactionConceptDate: transaction.concept.date,
                inheritorConceptId: conceptId,
                originalRelation: r.toRaw(),
            }),
        );

        const dbRawRelations = rawRelations.map((r) =>
            DbRawRelation.fromDomain(r),
        );
        await RawRelationSqlExecutor.insertInBulk(
            transaction.prismaTx,
            dbRawRelations,
        );
    }

    public static async searchActiveRelations({
        criteria,
        transaction,
    }: {
        criteria: ActiveRelationSearchCriteria;
        transaction: DbTransaction;
    }): Promise<ActiveRelation[]> {
        const dbRelations = await ActiveRelationSqlExecutor.select(
            transaction.prismaTx,
            criteria,
        );
        const relations = dbRelations.map((r) => r.toDomain());
        return relations;
    }
}
