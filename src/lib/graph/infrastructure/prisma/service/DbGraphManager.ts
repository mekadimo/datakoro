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
    public static async addAbstractionRelation(input: {
        abstractionId: ConceptId;
        conceptId: ConceptId;
        transaction: DbTransaction;
    }): Promise<ActiveRelation> {
        const relation = await DbGraphManager.addRelation({
            conceptId: input.conceptId,
            abstractionId: ID_ABSTRACTION,
            propertyId: ID_ABSTRACTION,
            orderNumber: null,
            qualityId: input.abstractionId,
            qualityTypeId: ID_CONCEPT,
            transaction: input.transaction,
        });
        return relation;
    }

    public static async addConcept(input: {
        transaction: DbTransaction;
        conceptId?: ConceptId;
        abstractionId: ConceptId;
    }): Promise<Concept> {
        const concept = Concept.create({
            conceptId:
                undefined == input.conceptId
                    ? ConceptId.generateRandom()
                    : input.conceptId,
            operationConceptId: input.transaction.concept.operationId,
            transactionConceptId: input.transaction.concept.id,
            transactionConceptDate: input.transaction.concept.date,
        });
        const dbConcept = DbConcept.fromDomain(concept);
        await ConceptSqlExecutor.insert(input.transaction.prismaTx, dbConcept);

        const rawSelfAbstractionRelation = RawRelation.create({
            operationConceptId: input.transaction.concept.operationId,
            transactionConceptId: input.transaction.concept.id,
            transactionConceptDate: input.transaction.concept.date,
            conceptId: concept.id,
            abstractionId: ID_ABSTRACTION,
            propertyId: ID_ABSTRACTION,
            orderNumber: null,
            qualityId: concept.id,
            qualityTypeId: ID_CONCEPT,
        });
        const dbSelfAbstractionRelation = DbRawRelation.fromDomain(
            rawSelfAbstractionRelation,
        );
        await RawRelationSqlExecutor.insert(
            input.transaction.prismaTx,
            dbSelfAbstractionRelation,
        );
        await DbGraphManager.addAbstractionRelation({
            transaction: input.transaction,
            conceptId: concept.id,
            abstractionId: input.abstractionId,
        });

        return concept;
    }

    public static async addRelation(input: {
        conceptId: ConceptId;
        abstractionId: ConceptId;
        propertyId: ConceptId;
        orderNumber: RelationOrderNumber | null;
        qualityId: ConceptId;
        qualityTypeId: ConceptId;
        transaction: DbTransaction;
    }): Promise<ActiveRelation> {
        const rawRelation = RawRelation.create({
            operationConceptId: input.transaction.concept.operationId,
            transactionConceptId: input.transaction.concept.id,
            transactionConceptDate: input.transaction.concept.date,
            conceptId: input.conceptId,
            abstractionId: input.abstractionId,
            propertyId: input.propertyId,
            orderNumber: input.orderNumber,
            qualityId: input.qualityId,
            qualityTypeId: input.qualityTypeId,
        });
        await DbGraphManager.assertNewRelationIsValid({
            rawRelation: rawRelation,
            transaction: input.transaction,
        });

        const dbRawRelation = DbRawRelation.fromDomain(rawRelation);
        await RawRelationSqlExecutor.insert(
            input.transaction.prismaTx,
            dbRawRelation,
        );
        if (rawRelation.isAbstraction) {
            await DbGraphManager.inheritRelations({
                conceptId: input.conceptId,
                abstractionId: input.abstractionId,
                transaction: input.transaction,
            });
        }

        // TODO: Add task to inheritance system

        const relation = ActiveRelation.fromRaw(rawRelation);
        return relation;
    }

    public static async assertConceptHasActiveAbstraction(input: {
        abstractionId: ConceptId;
        conceptId: ConceptId;
        transaction: DbTransaction;
    }): Promise<void> {
        const hasActiveAbstraction =
            await DbGraphManager.conceptHasActiveAbstraction({
                abstractionId: input.abstractionId,
                conceptId: input.conceptId,
                transaction: input.transaction,
            });
        if (!hasActiveAbstraction) {
            throw new ConceptHasNotAbstractionException({
                abstractionId: input.abstractionId.shortValue,
                conceptId: input.conceptId.shortValue,
            });
        }
    }

    public static async assertConceptHasActiveRelation(input: {
        abstractionId: ConceptId;
        conceptId: ConceptId;
        orderNumber: RelationOrderNumber | null;
        propertyId: ConceptId;
        qualityId: ConceptId;
        transaction: DbTransaction;
    }): Promise<void> {
        const hasActiveRelation = await DbGraphManager.conceptHasActiveRelation(
            {
                abstractionId: input.abstractionId,
                conceptId: input.conceptId,
                orderNumber: input.orderNumber,
                propertyId: input.propertyId,
                qualityId: input.qualityId,
                transaction: input.transaction,
            },
        );
        if (!hasActiveRelation) {
            throw new ConceptHasNotRelationException({
                conceptId: input.conceptId.shortValue,
                abstractionId: input.abstractionId.shortValue,
                orderNumber: input.orderNumber?.value ?? null,
                propertyId: input.propertyId.shortValue,
                qualityId: input.qualityId.shortValue,
            });
        }
    }

    public static async assertConceptIsActive(input: {
        conceptId: ConceptId;
        transaction: DbTransaction;
    }): Promise<void> {
        const isActive = await DbGraphManager.conceptIsActive({
            conceptId: input.conceptId,
            transaction: input.transaction,
        });
        if (!isActive) {
            throw new ConceptNotFoundException({
                id: input.conceptId.shortValue,
            });
        }
    }

    public static async assertConceptsAreActive(input: {
        conceptIds: ConceptId[];
        transaction: DbTransaction;
    }): Promise<void> {
        const haveActiveAbstraction =
            await DbGraphManager.conceptsHaveActiveAbstraction({
                abstractionId: ID_CONCEPT,
                conceptIds: input.conceptIds,
                transaction: input.transaction,
            });
        if (!haveActiveAbstraction) {
            const exceptions = input.conceptIds.map((id) => {
                // TODO: Filter only the ones that couldn't be found
                return new ConceptNotFoundException({ id: id.shortValue });
            });
            throw exceptions;
        }
    }

    public static async assertNewRelationIsValid(input: {
        rawRelation: RawRelation;
        transaction: DbTransaction;
    }): Promise<void> {
        if (input.rawRelation.isAbstraction) {
            await DbGraphManager.assertConceptIsActive({
                conceptId: input.rawRelation.conceptId,
                transaction: input.transaction,
            });
            await DbGraphManager.assertConceptIsActive({
                conceptId: input.rawRelation.qualityId,
                transaction: input.transaction,
            });
            // TODO: Check relations can be inherited for concepts and all concretions
        } else {
            await DbGraphManager.assertConceptHasActiveAbstraction({
                conceptId: input.rawRelation.conceptId,
                abstractionId: input.rawRelation.abstractionId,
                transaction: input.transaction,
            });
            await DbGraphManager.assertConceptHasActiveAbstraction({
                conceptId: input.rawRelation.qualityId,
                abstractionId: input.rawRelation.propertyId,
                transaction: input.transaction,
            });
        }
        // TODO: Check relation rules
        // TODO: If quality has an interval, check intersection of all is not empty
        //       (only relation number rule and magnitude)
        // TODO: Ensure all validations!
    }

    public static async conceptHasActiveAbstraction(input: {
        abstractionId: ConceptId;
        conceptId: ConceptId;
        transaction: DbTransaction;
    }): Promise<boolean> {
        const exists = await DbGraphManager.conceptHasActiveRelation({
            abstractionId: ID_ABSTRACTION,
            conceptId: input.conceptId,
            orderNumber: null,
            propertyId: ID_ABSTRACTION,
            qualityId: input.abstractionId,
            transaction: input.transaction,
        });
        return exists;
    }

    public static async conceptHasActiveRelation(input: {
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
                    value: input.conceptId,
                },
            },
            {
                field: ActiveRelationField.AbstractionId,
                filter: {
                    type: UuidFilterTypeValue.IsEqualTo,
                    value: input.abstractionId,
                },
            },
            {
                field: ActiveRelationField.PropertyId,
                filter: {
                    type: UuidFilterTypeValue.IsEqualTo,
                    value: input.propertyId,
                },
            },
            {
                field: ActiveRelationField.QualityId,
                filter: {
                    type: UuidFilterTypeValue.IsEqualTo,
                    value: input.qualityId,
                },
            },
        ];
        if (null != input.orderNumber) {
            filters.push({
                field: ActiveRelationField.OrderNumber,
                filter: {
                    type: IntegerNumberFilterType.IsEqualTo,
                    value: input.orderNumber.value,
                },
            });
        }
        const exists = await ActiveRelationSqlExecutor.selectExists(
            input.transaction.prismaTx,
            filters,
        );
        return exists;
    }

    public static async conceptIsActive(input: {
        conceptId: ConceptId;
        transaction: DbTransaction;
    }): Promise<boolean> {
        const exists = await DbGraphManager.conceptHasActiveAbstraction({
            abstractionId: ID_CONCEPT,
            conceptId: input.conceptId,
            transaction: input.transaction,
        });
        return exists;
    }

    public static async conceptsAreActive(input: {
        conceptIds: ConceptId[];
        transaction: DbTransaction;
    }): Promise<boolean> {
        const exist = await DbGraphManager.conceptsHaveActiveAbstraction({
            abstractionId: ID_CONCEPT,
            conceptIds: input.conceptIds,
            transaction: input.transaction,
        });
        return exist;
    }

    public static async conceptsHaveActiveAbstraction(input: {
        abstractionId: ConceptId;
        conceptIds: ConceptId[];
        transaction: DbTransaction;
    }): Promise<boolean> {
        const exist = await DbGraphManager.conceptsHaveActiveRelation({
            conceptIds: input.conceptIds,
            abstractionId: ID_ABSTRACTION,
            propertyId: ID_ABSTRACTION,
            orderNumber: null,
            qualityId: input.abstractionId,
            transaction: input.transaction,
        });
        return exist;
    }

    public static async conceptsHaveActiveRelation(input: {
        abstractionId: ConceptId;
        conceptIds: ConceptId[];
        orderNumber: RelationOrderNumber | null;
        propertyId: ConceptId;
        qualityId: ConceptId;
        transaction: DbTransaction;
    }): Promise<boolean> {
        // TODO: Instead of running a query for every concept ID,
        // check everything in a single query.
        for (const conceptId of input.conceptIds) {
            const exist = await DbGraphManager.conceptHasActiveRelation({
                conceptId: conceptId,
                abstractionId: input.abstractionId,
                propertyId: input.propertyId,
                orderNumber: input.orderNumber,
                qualityId: input.qualityId,
                transaction: input.transaction,
            });
            if (!exist) {
                return false;
            }
        }
        return true;
    }

    public static async findConceptById(input: {
        conceptId: ConceptId;
        transaction: DbTransaction;
    }): Promise<Concept | null> {
        const conceptIsActive = await DbGraphManager.conceptIsActive({
            conceptId: input.conceptId,
            transaction: input.transaction,
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
                        value: input.conceptId,
                    },
                },
            ],
        };
        const dbConcepts = await ConceptSqlExecutor.select(
            input.transaction.prismaTx,
            criteria,
        );
        if (0 === dbConcepts.length) {
            return null;
        }
        const dbConcept = dbConcepts[0];
        const concept = dbConcept.toDomain();
        return concept;
    }

    public static async findConceptsByIdInBulk(input: {
        conceptIds: ConceptId[];
        transaction: DbTransaction;
    }): Promise<Concept[]> {
        // TODO: Instead of running a query for every concept ID,
        // find all in a single query (a JOIN would be necessary in order
        // to check if it has any relations).
        const concepts: Concept[] = [];
        for (const conceptId of input.conceptIds) {
            const concept = await DbGraphManager.findConceptById({
                conceptId: conceptId,
                transaction: input.transaction,
            });
            if (null == concept) {
                continue;
            }
            concepts.push(concept);
        }
        return concepts;
    }

    public static async getConceptById(input: {
        conceptId: ConceptId;
        transaction: DbTransaction;
    }): Promise<Concept> {
        const concept = await DbGraphManager.findConceptById({
            conceptId: input.conceptId,
            transaction: input.transaction,
        });

        if (null == concept) {
            throw new ConceptNotFoundException({
                id: input.conceptId.shortValue,
            });
        }

        return concept;
    }

    public static async getConceptsByIdInBulk(input: {
        conceptIds: ConceptId[];
        transaction: DbTransaction;
    }): Promise<Concept[]> {
        const concepts = await DbGraphManager.findConceptsByIdInBulk({
            conceptIds: input.conceptIds,
            transaction: input.transaction,
        });

        if (input.conceptIds.length !== concepts.length) {
            const exceptions = [];
            const foundConceptIdShortValues = concepts.map(
                (c) => c.id.shortValue,
            );
            for (const conceptId of input.conceptIds) {
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

    public static async inheritRelations(input: {
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
                        value: input.conceptId,
                    },
                },
            ],
        };
        const relationsOfConcept = await DbGraphManager.searchActiveRelations({
            criteria: conceptCriteria,
            transaction: input.transaction,
        });
        const originRelationIdsOfConcept = relationsOfConcept.map(
            (r) => r.originRelationId,
        );

        const abstractionCriteria: ActiveRelationSearchCriteria = {
            filters: [
                {
                    field: ActiveRelationField.ConceptId,
                    filter: {
                        type: UuidFilterTypeValue.IsEqualTo,
                        value: input.abstractionId,
                    },
                },
                {
                    field: ActiveRelationField.OriginRelationId,
                    filter: {
                        type: UuidFilterTypeList.IsNotIn,
                        value: originRelationIdsOfConcept,
                    },
                },
            ],
        };
        const relationsOfAbstraction =
            await DbGraphManager.searchActiveRelations({
                transaction: input.transaction,
                criteria: abstractionCriteria,
            });

        const rawRelations = relationsOfAbstraction.map((r) =>
            RawRelation.createInherited({
                operationConceptId: input.transaction.concept.operationId,
                transactionConceptId: input.transaction.concept.id,
                transactionConceptDate: input.transaction.concept.date,
                inheritorConceptId: input.conceptId,
                originalRelation: r.toRaw(),
            }),
        );

        const dbRawRelations = rawRelations.map((r) =>
            DbRawRelation.fromDomain(r),
        );
        await RawRelationSqlExecutor.insertInBulk(
            input.transaction.prismaTx,
            dbRawRelations,
        );
    }

    public static async searchActiveRelations(input: {
        criteria: ActiveRelationSearchCriteria;
        transaction: DbTransaction;
    }): Promise<ActiveRelation[]> {
        const dbRelations = await ActiveRelationSqlExecutor.select(
            input.transaction.prismaTx,
            input.criteria,
        );
        const relations = dbRelations.map((r) => r.toDomain());
        return relations;
    }
}
