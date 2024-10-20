import type { ActiveRelation } from "../../../../graph/domain/model/Relation";
import type { ActiveRelationRuleSearchCriteria } from "../../../domain/model/RelationRule";
import type { DbTransaction } from "../model/DbTransaction";
import type { RawRelationRuleSearchCriteria } from "../../../domain/model/RelationRule";
import type { RelationRuleId } from "../../../domain/model/RelationRule";
import type { RelationRuleMaxRelationNumber } from "../../../domain/model/RelationRule";
import type { RelationRuleUniquePerBranch } from "../../../domain/model/RelationRule";
import type { RelationRuleUniquePerConcept } from "../../../domain/model/RelationRule";
import { ActiveRelationRule } from "../../../domain/model/RelationRule";
import { ActiveRelationRuleField } from "../../../domain/model/RelationRule";
import { ActiveRelationRuleSqlExecutor } from "../statement/ActiveRelationRuleSqlExecutor";
import { ConceptId } from "../../../../graph/domain/model/ConceptId";
import { DbGraphManager } from "../../../../graph/infrastructure/prisma/service/DbGraphManager";
import { DbRawRelationRule } from "../model/DbRawRelationRule";
import { ID_DATAKORO_RELATION_RULE } from "../../../../graph/domain/model/ConceptId";
import { ID_INACTIVE_DATAKORO_RELATION_RULE } from "../../../../graph/domain/model/ConceptId";
import { RawRelationRule } from "../../../domain/model/RelationRule";
import { RawRelationRuleField } from "../../../domain/model/RelationRule";
import { RawRelationRuleSqlExecutor } from "../statement/RawRelationRuleSqlExecutor";
import { RelationOrderCannotBeChangedException } from "../../../../shared/domain/model/DomainException";
import { RelationRuleFixedOrder } from "../../../domain/model/RelationRule";
import { RelationRuleNotFoundException } from "../../../../shared/domain/model/DomainException";
import { UuidFilterTypeList } from "../../../../shared/domain/model/Filter";
import { UuidFilterTypeValue } from "../../../../shared/domain/model/Filter";

export class DbRelationRuleManager {
    public static async addRelationRule(input: {
        abstractionId: ConceptId;
        fixedOrder: RelationRuleFixedOrder;
        maxRelationNumber: RelationRuleMaxRelationNumber;
        propertyId: ConceptId;
        transaction: DbTransaction;
        uniquePerBranch: RelationRuleUniquePerBranch;
        uniquePerConcept: RelationRuleUniquePerConcept;
    }): Promise<ActiveRelationRule> {
        // TODO: If already exists, error!
        // TODO: If already exists but inactive, insert again with active!
        //       (be careful with concept's relations...)

        const concept = await DbGraphManager.addConcept({
            abstractionId: ID_DATAKORO_RELATION_RULE,
            transaction: input.transaction,
        });
        const rawRelationRule = RawRelationRule.create({
            operationConceptId: input.transaction.concept.operationId,
            transactionConceptId: input.transaction.concept.id,
            transactionConceptDate: input.transaction.concept.date,
            conceptConceptId: concept.id,
            conceptAbstractionId: input.abstractionId,
            conceptPropertyId: input.propertyId,
            maxRelationNumber: input.maxRelationNumber,
            fixedOrder: input.fixedOrder,
            uniquePerBranch: input.uniquePerBranch,
            uniquePerConcept: input.uniquePerConcept,
        });
        const dbRawRelationRule = DbRawRelationRule.fromDomain(rawRelationRule);
        await RawRelationRuleSqlExecutor.insert(
            input.transaction.prismaTx,
            dbRawRelationRule,
        );

        // TODO: Create relations for abstraction, property, etc.

        const relationRule = ActiveRelationRule.fromRaw(rawRelationRule);
        return relationRule;
    }

    public static async assertRelationOrderCanBeUpdated(input: {
        relation: ActiveRelation;
        transaction: DbTransaction;
    }): Promise<void> {
        const relationRule =
            await DbRelationRuleManager.getActiveRelationRuleByAbstractionAndProperty(
                {
                    abstractionId: input.relation.abstractionId,
                    propertyId: input.relation.propertyId,
                    transaction: input.transaction,
                },
            );
        if (relationRule.fixedOrder.value && !input.relation.isOriginal) {
            throw new RelationOrderCannotBeChangedException({
                relationId: input.relation.id.shortValue,
                relationIsOriginal: input.relation.isOriginal,
            });
        }
    }

    public static async deleteRelationRule(input: {
        relationRuleId: RelationRuleId;
        transaction: DbTransaction;
    }): Promise<RawRelationRule> {
        const relationRule =
            await DbRelationRuleManager.getActiveRelationRuleById({
                relationRuleId: input.relationRuleId,
                transaction: input.transaction,
            });
        const rawRelationRule = relationRule.toRaw();

        rawRelationRule.setInactive({
            operationConceptId: input.transaction.concept.operationId,
            transactionConceptId: input.transaction.concept.id,
            transactionConceptDate: input.transaction.concept.date,
        });
        const dbRelationRule = DbRawRelationRule.fromDomain(rawRelationRule);
        await RawRelationRuleSqlExecutor.insert(
            input.transaction.prismaTx,
            dbRelationRule,
        );

        await DbGraphManager.addAbstractionRelation({
            conceptId: relationRule.conceptId,
            abstractionId: ID_INACTIVE_DATAKORO_RELATION_RULE,
            transaction: input.transaction,
        });

        // TODO: Add task to inheritance system (be careful!!)
        //       meaning: all relations are deleted (set as inactive)!

        return rawRelationRule;
    }

    public static async findActiveRelationRuleByAbstractionAndProperty(input: {
        abstractionId: ConceptId;
        propertyId: ConceptId;
        transaction: DbTransaction;
    }): Promise<ActiveRelationRule | null> {
        const criteria: ActiveRelationRuleSearchCriteria = {
            filters: [
                {
                    field: ActiveRelationRuleField.AbstractionId,
                    filter: {
                        type: UuidFilterTypeValue.IsEqualTo,
                        value: input.abstractionId,
                    },
                },
                {
                    field: ActiveRelationRuleField.PropertyId,
                    filter: {
                        type: UuidFilterTypeValue.IsEqualTo,
                        value: input.propertyId,
                    },
                },
            ],
        };
        const dbRelationRules = await ActiveRelationRuleSqlExecutor.select(
            input.transaction.prismaTx,
            criteria,
        );
        if (0 === dbRelationRules.length) {
            return null;
        }
        const dbRelationRule = dbRelationRules[0];
        const relationRule = dbRelationRule.toDomain();
        return relationRule;
    }

    public static async findActiveRelationRuleByConceptId(input: {
        conceptId: ConceptId;
        transaction: DbTransaction;
    }): Promise<ActiveRelationRule | null> {
        const criteria: ActiveRelationRuleSearchCriteria = {
            filters: [
                {
                    field: ActiveRelationRuleField.ConceptId,
                    filter: {
                        type: UuidFilterTypeValue.IsEqualTo,
                        value: input.conceptId,
                    },
                },
            ],
        };
        const dbRelationRules = await ActiveRelationRuleSqlExecutor.select(
            input.transaction.prismaTx,
            criteria,
        );
        if (0 === dbRelationRules.length) {
            return null;
        }
        const dbRelationRule = dbRelationRules[0];
        const relationRule = dbRelationRule.toDomain();
        return relationRule;
    }

    public static async findActiveRelationRuleById(input: {
        relationRuleId: RelationRuleId;
        transaction: DbTransaction;
    }): Promise<ActiveRelationRule | null> {
        const criteria: ActiveRelationRuleSearchCriteria = {
            filters: [
                {
                    field: ActiveRelationRuleField.Id,
                    filter: {
                        type: UuidFilterTypeValue.IsEqualTo,
                        value: input.relationRuleId,
                    },
                },
            ],
        };
        const dbRelationRules = await ActiveRelationRuleSqlExecutor.select(
            input.transaction.prismaTx,
            criteria,
        );
        if (0 === dbRelationRules.length) {
            return null;
        }
        const dbRelationRule = dbRelationRules[0];
        const relationRule = dbRelationRule.toDomain();
        return relationRule;
    }

    public static async findActiveRelationRulesByIdInBulk(input: {
        relationRuleIds: RelationRuleId[];
        transaction: DbTransaction;
    }): Promise<ActiveRelationRule[]> {
        const criteria: ActiveRelationRuleSearchCriteria = {
            filters: [
                {
                    field: ActiveRelationRuleField.Id,
                    filter: {
                        type: UuidFilterTypeList.IsIn,
                        value: input.relationRuleIds,
                    },
                },
            ],
        };
        const dbActiveRelationRules =
            await ActiveRelationRuleSqlExecutor.select(
                input.transaction.prismaTx,
                criteria,
            );
        const activeRelationRules = dbActiveRelationRules.map((r) =>
            r.toDomain(),
        );
        return activeRelationRules;
    }

    public static async findRawRelationRuleById(input: {
        relationRuleId: RelationRuleId;
        transaction: DbTransaction;
    }): Promise<RawRelationRule | null> {
        const criteria: RawRelationRuleSearchCriteria = {
            filters: [
                {
                    field: RawRelationRuleField.Id,
                    filter: {
                        type: UuidFilterTypeValue.IsEqualTo,
                        value: input.relationRuleId,
                    },
                },
            ],
        };
        const dbRelationRules = await RawRelationRuleSqlExecutor.select(
            input.transaction.prismaTx,
            criteria,
        );
        if (0 === dbRelationRules.length) {
            return null;
        }
        const dbRelationRule = dbRelationRules[0];
        const relationRule = dbRelationRule.toDomain();
        return relationRule;
    }

    public static async findRawRelationRulesByIdInBulk(input: {
        relationRuleIds: RelationRuleId[];
        transaction: DbTransaction;
    }): Promise<RawRelationRule[]> {
        const criteria: RawRelationRuleSearchCriteria = {
            filters: [
                {
                    field: RawRelationRuleField.Id,
                    filter: {
                        type: UuidFilterTypeList.IsIn,
                        value: input.relationRuleIds,
                    },
                },
            ],
        };
        const dbRawRelationRules = await RawRelationRuleSqlExecutor.select(
            input.transaction.prismaTx,
            criteria,
        );
        const rawRelationRules = dbRawRelationRules.map((r) => r.toDomain());
        return rawRelationRules;
    }

    public static async getActiveRelationRuleByAbstractionAndProperty(input: {
        abstractionId: ConceptId;
        propertyId: ConceptId;
        transaction: DbTransaction;
    }): Promise<ActiveRelationRule> {
        const activeRelationRule =
            await DbRelationRuleManager.findActiveRelationRuleByAbstractionAndProperty(
                {
                    abstractionId: input.abstractionId,
                    propertyId: input.propertyId,
                    transaction: input.transaction,
                },
            );

        if (null == activeRelationRule) {
            throw new RelationRuleNotFoundException({
                abstractionId: input.abstractionId.shortValue,
                propertyId: input.propertyId.shortValue,
            });
        }

        return activeRelationRule;
    }

    public static async getActiveRelationRuleByConceptId(input: {
        conceptId: ConceptId;
        transaction: DbTransaction;
    }): Promise<ActiveRelationRule> {
        const activeRelationRule =
            await DbRelationRuleManager.findActiveRelationRuleByConceptId({
                conceptId: input.conceptId,
                transaction: input.transaction,
            });

        if (null == activeRelationRule) {
            throw new RelationRuleNotFoundException({
                conceptId: input.conceptId.shortValue,
            });
        }

        return activeRelationRule;
    }

    public static async getActiveRelationRuleById(input: {
        relationRuleId: RelationRuleId;
        transaction: DbTransaction;
    }): Promise<ActiveRelationRule> {
        const activeRelationRule =
            await DbRelationRuleManager.findActiveRelationRuleById({
                relationRuleId: input.relationRuleId,
                transaction: input.transaction,
            });

        if (null == activeRelationRule) {
            throw new RelationRuleNotFoundException({
                relationRuleId: input.relationRuleId.shortValue,
            });
        }

        return activeRelationRule;
    }

    public static async getActiveRelationRulesByIdInBulk(input: {
        relationRuleIds: RelationRuleId[];
        transaction: DbTransaction;
    }): Promise<ActiveRelationRule[]> {
        const activeRelationRules =
            await DbRelationRuleManager.findActiveRelationRulesByIdInBulk({
                relationRuleIds: input.relationRuleIds,
                transaction: input.transaction,
            });

        if (input.relationRuleIds.length !== activeRelationRules.length) {
            const exceptions = [];
            const foundIdShortValues = activeRelationRules.map(
                (c) => c.id.shortValue,
            );
            for (const relationRuleId of input.relationRuleIds) {
                if (foundIdShortValues.includes(relationRuleId.shortValue)) {
                    continue;
                }
                const exception = new RelationRuleNotFoundException({
                    relationRuleId: relationRuleId.shortValue,
                });
                exceptions.push(exception);
            }
            throw exceptions;
        }

        return activeRelationRules;
    }

    public static async getRawRelationRuleById(input: {
        relationRuleId: RelationRuleId;
        transaction: DbTransaction;
    }): Promise<RawRelationRule> {
        const rawRelationRule =
            await DbRelationRuleManager.findRawRelationRuleById({
                relationRuleId: input.relationRuleId,
                transaction: input.transaction,
            });

        if (null == rawRelationRule) {
            throw new RelationRuleNotFoundException({
                relationRuleId: input.relationRuleId.shortValue,
            });
        }

        return rawRelationRule;
    }

    public static async getRawRelationRulesByIdInBulk(input: {
        relationRuleIds: RelationRuleId[];
        transaction: DbTransaction;
    }): Promise<RawRelationRule[]> {
        const rawRelationRules =
            await DbRelationRuleManager.findRawRelationRulesByIdInBulk({
                relationRuleIds: input.relationRuleIds,
                transaction: input.transaction,
            });

        if (input.relationRuleIds.length !== rawRelationRules.length) {
            const exceptions = [];
            const foundIdShortValues = rawRelationRules.map(
                (c) => c.id.shortValue,
            );
            for (const relationRuleId of input.relationRuleIds) {
                if (foundIdShortValues.includes(relationRuleId.shortValue)) {
                    continue;
                }
                const exception = new RelationRuleNotFoundException({
                    relationRuleId: relationRuleId.shortValue,
                });
                exceptions.push(exception);
            }
            throw exceptions;
        }

        return rawRelationRules;
    }

    public static async searchActiveRelationRules(input: {
        criteria: ActiveRelationRuleSearchCriteria;
        transaction: DbTransaction;
    }): Promise<ActiveRelationRule[]> {
        const dbRelationRules = await ActiveRelationRuleSqlExecutor.select(
            input.transaction.prismaTx,
            input.criteria,
        );
        const relationRules = dbRelationRules.map((r) => r.toDomain());
        return relationRules;
    }

    public static async searchRawRelationRules(input: {
        criteria: RawRelationRuleSearchCriteria;
        transaction: DbTransaction;
    }): Promise<RawRelationRule[]> {
        const dbRelationRules = await RawRelationRuleSqlExecutor.select(
            input.transaction.prismaTx,
            input.criteria,
        );
        const relationRules = dbRelationRules.map((r) => r.toDomain());
        return relationRules;
    }

    public static async updateRelationRule(input: {
        fixedOrder: RelationRuleFixedOrder;
        maxRelationNumber: RelationRuleMaxRelationNumber;
        relationRuleId: RelationRuleId;
        transaction: DbTransaction;
        uniquePerBranch: RelationRuleUniquePerBranch;
        uniquePerConcept: RelationRuleUniquePerConcept;
    }): Promise<ActiveRelationRule> {
        const relationRule =
            await DbRelationRuleManager.getActiveRelationRuleById({
                relationRuleId: input.relationRuleId,
                transaction: input.transaction,
            });
        relationRule.update({
            operationConceptId: input.transaction.concept.operationId,
            transactionConceptId: input.transaction.concept.id,
            transactionConceptDate: input.transaction.concept.date,
            fixedOrder: input.fixedOrder,
            uniquePerBranch: input.uniquePerBranch,
            uniquePerConcept: input.uniquePerConcept,
            maxRelationNumber: input.maxRelationNumber,
        });

        // TODO: Assert rule changes are compatible with ALL relations...
        // self.assert_relation_rule_can_be_updated(&relation_rule)?;

        const rawRelationRule = relationRule.toRaw();
        const dbRelationRule = DbRawRelationRule.fromDomain(rawRelationRule);
        await RawRelationRuleSqlExecutor.insert(
            input.transaction.prismaTx,
            dbRelationRule,
        );

        // TODO: Create/update/delete relations for max number, booleans, etc.

        return relationRule;
    }
}
