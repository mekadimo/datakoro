import type { ActiveRelationRuleFieldOrder } from "../../../domain/model/RelationRule";
import type { ActiveRelationRuleFilter } from "../../../domain/model/RelationRule";
import type { DbBooleanFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import type { DbDateTimeFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import type { DbFieldOrderDirection } from "../../../../shared/infrastructure/prisma/model/DbFieldOrderDirection";
import type { DbNullableIntegerNumberFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import type { DbUuidFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import { ActiveRelationRule } from "../../../domain/model/RelationRule";
import { ActiveRelationRuleField } from "../../../domain/model/RelationRule";
import { DbModel } from "../../../../shared/infrastructure/prisma/model/DbModel";
import { RelationRuleAbstractionId } from "../../../domain/model/RelationRule";
import { RelationRuleConceptId } from "../../../domain/model/RelationRule";
import { RelationRuleFixedOrder } from "../../../domain/model/RelationRule";
import { RelationRuleId } from "../../../domain/model/RelationRule";
import { RelationRuleMaxRelationNumber } from "../../../domain/model/RelationRule";
import { RelationRuleOperationId } from "../../../domain/model/RelationRule";
import { RelationRulePropertyId } from "../../../domain/model/RelationRule";
import { RelationRuleTransactionDate } from "../../../domain/model/RelationRule";
import { RelationRuleTransactionId } from "../../../domain/model/RelationRule";
import { RelationRuleUniquePerBranch } from "../../../domain/model/RelationRule";
import { RelationRuleUniquePerConcept } from "../../../domain/model/RelationRule";

type DbActiveRelationRuleFilter =
    | { concept_id: DbUuidFilter }
    | { concept_id_abstraction: DbUuidFilter }
    | { concept_id_property: DbUuidFilter }
    | { fixed_order: DbBooleanFilter }
    | { id: DbUuidFilter }
    | { max_relation_number: DbNullableIntegerNumberFilter }
    | { operation_concept_id: DbUuidFilter }
    | { transaction_concept_id: DbUuidFilter }
    | { transaction_date: DbDateTimeFilter }
    | { unique_per_branch: DbBooleanFilter }
    | { unique_per_concept: DbBooleanFilter };

type DbActiveRelationRuleFieldOrder =
    | { concept_id: DbFieldOrderDirection }
    | { concept_id_abstraction: DbFieldOrderDirection }
    | { concept_id_property: DbFieldOrderDirection }
    | { fixed_order: DbFieldOrderDirection }
    | { id: DbFieldOrderDirection }
    | { max_relation_number: DbFieldOrderDirection }
    | { operation_concept_id: DbFieldOrderDirection }
    | { transaction_concept_id: DbFieldOrderDirection }
    | { transaction_date: DbFieldOrderDirection }
    | { unique_per_branch: DbFieldOrderDirection }
    | { unique_per_concept: DbFieldOrderDirection };

export class DbActiveRelationRule {
    concept_id: string;
    concept_id_abstraction: string;
    concept_id_property: string;
    fixed_order: boolean;
    id: string;
    max_relation_number: bigint | null;
    operation_concept_id: string;
    transaction_concept_id: string;
    transaction_date: Date;
    unique_per_branch: boolean;
    unique_per_concept: boolean;

    constructor({
        concept_id,
        concept_id_abstraction,
        concept_id_property,
        fixed_order,
        id,
        max_relation_number,
        operation_concept_id,
        transaction_concept_id,
        transaction_date,
        unique_per_branch,
        unique_per_concept,
    }: {
        concept_id: string;
        concept_id_abstraction: string;
        concept_id_property: string;
        fixed_order: boolean;
        id: string;
        max_relation_number: bigint | null;
        operation_concept_id: string;
        transaction_concept_id: string;
        transaction_date: Date;
        unique_per_branch: boolean;
        unique_per_concept: boolean;
    }) {
        this.concept_id = concept_id;
        this.concept_id_abstraction = concept_id_abstraction;
        this.concept_id_property = concept_id_property;
        this.fixed_order = fixed_order;
        this.id = id;
        this.max_relation_number = max_relation_number;
        this.operation_concept_id = operation_concept_id;
        this.transaction_concept_id = transaction_concept_id;
        this.transaction_date = transaction_date;
        this.unique_per_branch = unique_per_branch;
        this.unique_per_concept = unique_per_concept;
    }

    public static fromDomain(
        activeRelationRule: ActiveRelationRule,
    ): DbActiveRelationRule {
        return new DbActiveRelationRule({
            concept_id: activeRelationRule.conceptId.longValue,
            concept_id_abstraction: activeRelationRule.abstractionId.longValue,
            concept_id_property: activeRelationRule.propertyId.longValue,
            fixed_order: activeRelationRule.fixedOrder.value,
            id: activeRelationRule.id.longValue,
            max_relation_number:
                null == activeRelationRule.maxRelationNumber
                    ? null
                    : activeRelationRule.maxRelationNumber.value,
            operation_concept_id: activeRelationRule.operationId.longValue,
            transaction_concept_id: activeRelationRule.transactionId.longValue,
            transaction_date: activeRelationRule.transactionDate.value,
            unique_per_branch: activeRelationRule.uniquePerBranch.value,
            unique_per_concept: activeRelationRule.uniquePerConcept.value,
        });
    }

    public static toDbFilter(
        filter: ActiveRelationRuleFilter,
    ): DbActiveRelationRuleFilter {
        switch (filter.field) {
            case ActiveRelationRuleField.ConceptId: {
                return {
                    concept_id: DbModel.toDbUuidFilter(filter.filter),
                };
            }
            case ActiveRelationRuleField.AbstractionId: {
                return {
                    concept_id_abstraction: DbModel.toDbUuidFilter(
                        filter.filter,
                    ),
                };
            }
            case ActiveRelationRuleField.PropertyId: {
                return {
                    concept_id_property: DbModel.toDbUuidFilter(filter.filter),
                };
            }
            case ActiveRelationRuleField.FixedOrder: {
                return {
                    fixed_order: DbModel.toDbBooleanFilter(filter.filter),
                };
            }
            case ActiveRelationRuleField.Id: {
                return {
                    id: DbModel.toDbUuidFilter(filter.filter),
                };
            }
            case ActiveRelationRuleField.MaxRelationNumber: {
                return {
                    max_relation_number:
                        DbModel.toDbNullableIntegerNumberFilter(filter.filter),
                };
            }
            case ActiveRelationRuleField.OperationId: {
                return {
                    operation_concept_id: DbModel.toDbUuidFilter(filter.filter),
                };
            }
            case ActiveRelationRuleField.TransactionDate: {
                return {
                    transaction_date: DbModel.toDbDateTimeFilter(filter.filter),
                };
            }
            case ActiveRelationRuleField.TransactionId: {
                return {
                    transaction_concept_id: DbModel.toDbUuidFilter(
                        filter.filter,
                    ),
                };
            }
            case ActiveRelationRuleField.UniquePerBranch: {
                return {
                    unique_per_branch: DbModel.toDbBooleanFilter(filter.filter),
                };
            }
            case ActiveRelationRuleField.UniquePerConcept: {
                return {
                    unique_per_concept: DbModel.toDbBooleanFilter(
                        filter.filter,
                    ),
                };
            }
        }
    }

    public static toDbFilterWhere(filters: ActiveRelationRuleFilter[]): {
        AND: DbActiveRelationRuleFilter[];
    } {
        const dbFilters = filters.map((f) =>
            DbActiveRelationRule.toDbFilter(f),
        );
        return { AND: dbFilters };
    }

    public static toDbOrder(
        order: ActiveRelationRuleFieldOrder,
    ): DbActiveRelationRuleFieldOrder {
        switch (order.field) {
            case ActiveRelationRuleField.ConceptId: {
                return {
                    concept_id: DbModel.toDbOrderDirection(order.direction),
                };
            }
            case ActiveRelationRuleField.AbstractionId: {
                return {
                    concept_id_abstraction: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case ActiveRelationRuleField.PropertyId: {
                return {
                    concept_id_property: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case ActiveRelationRuleField.FixedOrder: {
                return {
                    fixed_order: DbModel.toDbOrderDirection(order.direction),
                };
            }
            case ActiveRelationRuleField.Id: {
                return {
                    id: DbModel.toDbOrderDirection(order.direction),
                };
            }
            case ActiveRelationRuleField.MaxRelationNumber: {
                return {
                    max_relation_number: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case ActiveRelationRuleField.OperationId: {
                return {
                    operation_concept_id: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case ActiveRelationRuleField.TransactionDate: {
                return {
                    transaction_date: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case ActiveRelationRuleField.TransactionId: {
                return {
                    transaction_concept_id: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case ActiveRelationRuleField.UniquePerBranch: {
                return {
                    unique_per_branch: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case ActiveRelationRuleField.UniquePerConcept: {
                return {
                    unique_per_concept: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
        }
    }

    public static toDbOrderBy(
        orderBy: ActiveRelationRuleFieldOrder[],
    ): DbActiveRelationRuleFieldOrder[] {
        const dbOrderBy = orderBy.map((o) => DbActiveRelationRule.toDbOrder(o));
        return dbOrderBy;
    }

    public toDomain(): ActiveRelationRule {
        return new ActiveRelationRule({
            abstractionId: new RelationRuleAbstractionId(
                this.concept_id_abstraction,
            ),
            conceptId: new RelationRuleConceptId(this.concept_id),
            fixedOrder: new RelationRuleFixedOrder(this.fixed_order),
            id: new RelationRuleId(this.id),
            maxRelationNumber:
                null == this.max_relation_number
                    ? null
                    : new RelationRuleMaxRelationNumber(
                          this.max_relation_number,
                      ),
            operationId: new RelationRuleOperationId(this.operation_concept_id),
            propertyId: new RelationRulePropertyId(this.concept_id_property),
            transactionDate: new RelationRuleTransactionDate(
                this.transaction_date,
            ),
            transactionId: new RelationRuleTransactionId(
                this.transaction_concept_id,
            ),
            uniquePerBranch: new RelationRuleUniquePerBranch(
                this.unique_per_branch,
            ),
            uniquePerConcept: new RelationRuleUniquePerConcept(
                this.unique_per_concept,
            ),
        });
    }
}
