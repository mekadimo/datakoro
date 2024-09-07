import type { ActiveRelation } from "../../../../graph/domain/model/Relation";
import type { ActiveRelationRuleSearchCriteria } from "../../../domain/model/RelationRule";
import type { DbTransaction } from "../../../../shared/infrastructure/prisma/model/DbTransaction";
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
    public static async addRelationRule({
        abstractionId,
        fixedOrder,
        maxRelationNumber,
        propertyId,
        transaction,
        uniquePerBranch,
        uniquePerConcept,
    }: {
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
            transaction: transaction,
        });
        const rawRelationRule = RawRelationRule.create({
            operationConceptId: transaction.currentOperationConceptId,
            transactionConceptId: transaction.currentTransactionConceptId,
            transactionConceptDate: transaction.currentTransactionConceptDate,
            conceptConceptId: concept.id,
            conceptAbstractionId: abstractionId,
            conceptPropertyId: propertyId,
            maxRelationNumber: maxRelationNumber,
            fixedOrder: fixedOrder,
            uniquePerBranch: uniquePerBranch,
            uniquePerConcept: uniquePerConcept,
        });
        const dbRawRelationRule = DbRawRelationRule.fromDomain(rawRelationRule);
        await RawRelationRuleSqlExecutor.insert(
            transaction.prismaTx,
            dbRawRelationRule,
        );

        // TODO: Create relations for abstraction, property, etc.

        const relationRule = ActiveRelationRule.fromRaw(rawRelationRule);
        return relationRule;
    }

    public static async assertRelationOrderCanBeUpdated({
        relation,
        transaction,
    }: {
        relation: ActiveRelation;
        transaction: DbTransaction;
    }): Promise<void> {
        const relationRule =
            await DbRelationRuleManager.getActiveRelationRuleByAbstractionAndProperty(
                {
                    abstractionId: relation.abstractionId,
                    propertyId: relation.propertyId,
                    transaction: transaction,
                },
            );
        if (relationRule.fixedOrder.value && !relation.isOriginal) {
            throw new RelationOrderCannotBeChangedException({
                relationId: relation.id.shortValue,
                relationIsOriginal: relation.isOriginal,
            });
        }
    }

    public static async deleteRelationRule({
        relationRuleId,
        transaction,
    }: {
        relationRuleId: RelationRuleId;
        transaction: DbTransaction;
    }): Promise<RawRelationRule> {
        const relationRule =
            await DbRelationRuleManager.getActiveRelationRuleById({
                relationRuleId: relationRuleId,
                transaction: transaction,
            });
        const rawRelationRule = relationRule.toRaw();

        rawRelationRule.setInactive({
            operationConceptId: transaction.currentOperationConceptId,
            transactionConceptId: transaction.currentTransactionConceptId,
            transactionConceptDate: transaction.currentTransactionConceptDate,
        });
        const dbRelationRule = DbRawRelationRule.fromDomain(rawRelationRule);
        await RawRelationRuleSqlExecutor.insert(
            transaction.prismaTx,
            dbRelationRule,
        );

        await DbGraphManager.addAbstractionRelation({
            conceptId: relationRule.conceptId,
            abstractionId: ID_INACTIVE_DATAKORO_RELATION_RULE,
            transaction: transaction,
        });

        // TODO: Add task to inheritance system (be careful!!)
        //       meaning: all relations are deleted (set as inactive)!

        return rawRelationRule;
    }

    public static async findActiveRelationRuleByAbstractionAndProperty({
        abstractionId,
        propertyId,
        transaction,
    }: {
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
                        value: abstractionId,
                    },
                },
                {
                    field: ActiveRelationRuleField.PropertyId,
                    filter: {
                        type: UuidFilterTypeValue.IsEqualTo,
                        value: propertyId,
                    },
                },
            ],
        };
        const dbRelationRules = await ActiveRelationRuleSqlExecutor.select(
            transaction.prismaTx,
            criteria,
        );
        if (0 === dbRelationRules.length) {
            return null;
        }
        const dbRelationRule = dbRelationRules[0];
        const relationRule = dbRelationRule.toDomain();
        return relationRule;
    }

    public static async findActiveRelationRuleByConceptId({
        conceptId,
        transaction,
    }: {
        conceptId: ConceptId;
        transaction: DbTransaction;
    }): Promise<ActiveRelationRule | null> {
        const criteria: ActiveRelationRuleSearchCriteria = {
            filters: [
                {
                    field: ActiveRelationRuleField.ConceptId,
                    filter: {
                        type: UuidFilterTypeValue.IsEqualTo,
                        value: conceptId,
                    },
                },
            ],
        };
        const dbRelationRules = await ActiveRelationRuleSqlExecutor.select(
            transaction.prismaTx,
            criteria,
        );
        if (0 === dbRelationRules.length) {
            return null;
        }
        const dbRelationRule = dbRelationRules[0];
        const relationRule = dbRelationRule.toDomain();
        return relationRule;
    }

    public static async findActiveRelationRuleById({
        relationRuleId,
        transaction,
    }: {
        relationRuleId: RelationRuleId;
        transaction: DbTransaction;
    }): Promise<ActiveRelationRule | null> {
        const criteria: ActiveRelationRuleSearchCriteria = {
            filters: [
                {
                    field: ActiveRelationRuleField.Id,
                    filter: {
                        type: UuidFilterTypeValue.IsEqualTo,
                        value: relationRuleId,
                    },
                },
            ],
        };
        const dbRelationRules = await ActiveRelationRuleSqlExecutor.select(
            transaction.prismaTx,
            criteria,
        );
        if (0 === dbRelationRules.length) {
            return null;
        }
        const dbRelationRule = dbRelationRules[0];
        const relationRule = dbRelationRule.toDomain();
        return relationRule;
    }

    public static async findActiveRelationRulesByIdInBulk({
        relationRuleIds,
        transaction,
    }: {
        relationRuleIds: RelationRuleId[];
        transaction: DbTransaction;
    }): Promise<ActiveRelationRule[]> {
        const criteria: ActiveRelationRuleSearchCriteria = {
            filters: [
                {
                    field: ActiveRelationRuleField.Id,
                    filter: {
                        type: UuidFilterTypeList.IsIn,
                        value: relationRuleIds,
                    },
                },
            ],
        };
        const dbActiveRelationRules =
            await ActiveRelationRuleSqlExecutor.select(
                transaction.prismaTx,
                criteria,
            );
        const activeRelationRules = dbActiveRelationRules.map((r) =>
            r.toDomain(),
        );
        return activeRelationRules;
    }

    public static async findRawRelationRuleById({
        relationRuleId,
        transaction,
    }: {
        relationRuleId: RelationRuleId;
        transaction: DbTransaction;
    }): Promise<RawRelationRule | null> {
        const criteria: RawRelationRuleSearchCriteria = {
            filters: [
                {
                    field: RawRelationRuleField.Id,
                    filter: {
                        type: UuidFilterTypeValue.IsEqualTo,
                        value: relationRuleId,
                    },
                },
            ],
        };
        const dbRelationRules = await RawRelationRuleSqlExecutor.select(
            transaction.prismaTx,
            criteria,
        );
        if (0 === dbRelationRules.length) {
            return null;
        }
        const dbRelationRule = dbRelationRules[0];
        const relationRule = dbRelationRule.toDomain();
        return relationRule;
    }

    public static async findRawRelationRulesByIdInBulk({
        relationRuleIds,
        transaction,
    }: {
        relationRuleIds: RelationRuleId[];
        transaction: DbTransaction;
    }): Promise<RawRelationRule[]> {
        const criteria: RawRelationRuleSearchCriteria = {
            filters: [
                {
                    field: RawRelationRuleField.Id,
                    filter: {
                        type: UuidFilterTypeList.IsIn,
                        value: relationRuleIds,
                    },
                },
            ],
        };
        const dbRawRelationRules = await RawRelationRuleSqlExecutor.select(
            transaction.prismaTx,
            criteria,
        );
        const rawRelationRules = dbRawRelationRules.map((r) => r.toDomain());
        return rawRelationRules;
    }

    public static async getActiveRelationRuleByAbstractionAndProperty({
        abstractionId,
        propertyId,
        transaction,
    }: {
        abstractionId: ConceptId;
        propertyId: ConceptId;
        transaction: DbTransaction;
    }): Promise<ActiveRelationRule> {
        const activeRelationRule =
            await DbRelationRuleManager.findActiveRelationRuleByAbstractionAndProperty(
                {
                    abstractionId: abstractionId,
                    propertyId: propertyId,
                    transaction: transaction,
                },
            );

        if (null == activeRelationRule) {
            throw new RelationRuleNotFoundException({
                abstractionId: abstractionId.shortValue,
                propertyId: propertyId.shortValue,
            });
        }

        return activeRelationRule;
    }

    public static async getActiveRelationRuleByConceptId({
        conceptId,
        transaction,
    }: {
        conceptId: ConceptId;
        transaction: DbTransaction;
    }): Promise<ActiveRelationRule> {
        const activeRelationRule =
            await DbRelationRuleManager.findActiveRelationRuleByConceptId({
                conceptId: conceptId,
                transaction: transaction,
            });

        if (null == activeRelationRule) {
            throw new RelationRuleNotFoundException({
                conceptId: conceptId.shortValue,
            });
        }

        return activeRelationRule;
    }

    public static async getActiveRelationRuleById({
        relationRuleId,
        transaction,
    }: {
        relationRuleId: RelationRuleId;
        transaction: DbTransaction;
    }): Promise<ActiveRelationRule> {
        const activeRelationRule =
            await DbRelationRuleManager.findActiveRelationRuleById({
                relationRuleId: relationRuleId,
                transaction: transaction,
            });

        if (null == activeRelationRule) {
            throw new RelationRuleNotFoundException({
                relationRuleId: relationRuleId.shortValue,
            });
        }

        return activeRelationRule;
    }

    public static async getActiveRelationRulesByIdInBulk({
        relationRuleIds,
        transaction,
    }: {
        relationRuleIds: RelationRuleId[];
        transaction: DbTransaction;
    }): Promise<ActiveRelationRule[]> {
        const activeRelationRules =
            await DbRelationRuleManager.findActiveRelationRulesByIdInBulk({
                relationRuleIds: relationRuleIds,
                transaction: transaction,
            });

        if (relationRuleIds.length !== activeRelationRules.length) {
            const exceptions = [];
            const foundIdShortValues = activeRelationRules.map(
                (c) => c.id.shortValue,
            );
            for (const relationRuleId of relationRuleIds) {
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

    public static async getRawRelationRuleById({
        relationRuleId,
        transaction,
    }: {
        relationRuleId: RelationRuleId;
        transaction: DbTransaction;
    }): Promise<RawRelationRule> {
        const rawRelationRule =
            await DbRelationRuleManager.findRawRelationRuleById({
                relationRuleId: relationRuleId,
                transaction: transaction,
            });

        if (null == rawRelationRule) {
            throw new RelationRuleNotFoundException({
                relationRuleId: relationRuleId.shortValue,
            });
        }

        return rawRelationRule;
    }

    public static async getRawRelationRulesByIdInBulk({
        relationRuleIds,
        transaction,
    }: {
        relationRuleIds: RelationRuleId[];
        transaction: DbTransaction;
    }): Promise<RawRelationRule[]> {
        const rawRelationRules =
            await DbRelationRuleManager.findRawRelationRulesByIdInBulk({
                relationRuleIds: relationRuleIds,
                transaction: transaction,
            });

        if (relationRuleIds.length !== rawRelationRules.length) {
            const exceptions = [];
            const foundIdShortValues = rawRelationRules.map(
                (c) => c.id.shortValue,
            );
            for (const relationRuleId of relationRuleIds) {
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

    public static async searchActiveRelationRules({
        criteria,
        transaction,
    }: {
        criteria: ActiveRelationRuleSearchCriteria;
        transaction: DbTransaction;
    }): Promise<ActiveRelationRule[]> {
        const dbRelationRules = await ActiveRelationRuleSqlExecutor.select(
            transaction.prismaTx,
            criteria,
        );
        const relationRules = dbRelationRules.map((r) => r.toDomain());
        return relationRules;
    }

    public static async searchRawRelationRules({
        criteria,
        transaction,
    }: {
        criteria: RawRelationRuleSearchCriteria;
        transaction: DbTransaction;
    }): Promise<RawRelationRule[]> {
        const dbRelationRules = await RawRelationRuleSqlExecutor.select(
            transaction.prismaTx,
            criteria,
        );
        const relationRules = dbRelationRules.map((r) => r.toDomain());
        return relationRules;
    }

    public static async updateRelationRule({
        fixedOrder,
        maxRelationNumber,
        relationRuleId,
        transaction,
        uniquePerBranch,
        uniquePerConcept,
    }: {
        fixedOrder: RelationRuleFixedOrder;
        maxRelationNumber: RelationRuleMaxRelationNumber;
        relationRuleId: RelationRuleId;
        transaction: DbTransaction;
        uniquePerBranch: RelationRuleUniquePerBranch;
        uniquePerConcept: RelationRuleUniquePerConcept;
    }): Promise<ActiveRelationRule> {
        const relationRule =
            await DbRelationRuleManager.getActiveRelationRuleById({
                relationRuleId: relationRuleId,
                transaction: transaction,
            });
        relationRule.update({
            operationConceptId: transaction.currentOperationConceptId,
            transactionConceptId: transaction.currentTransactionConceptId,
            transactionConceptDate: transaction.currentTransactionConceptDate,
            fixedOrder: fixedOrder,
            uniquePerBranch: uniquePerBranch,
            uniquePerConcept: uniquePerConcept,
            maxRelationNumber: maxRelationNumber,
        });

        // TODO: Assert rule changes are compatible with ALL relations...
        // self.assert_relation_rule_can_be_updated(&relation_rule)?;

        const rawRelationRule = relationRule.toRaw();
        const dbRelationRule = DbRawRelationRule.fromDomain(rawRelationRule);
        await RawRelationRuleSqlExecutor.insert(
            transaction.prismaTx,
            dbRelationRule,
        );

        // TODO: Create/update/delete relations for max number, booleans, etc.

        return relationRule;
    }
}
