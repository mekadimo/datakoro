import type { RawRelationRuleFieldOrder } from "../../../domain/model/RelationRule";
import type { RawRelationRuleFilter } from "../../../domain/model/RelationRule";
import type { DbBooleanFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import type { DbDateTimeFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import type { DbFieldOrderDirection } from "../../../../shared/infrastructure/prisma/model/DbFieldOrderDirection";
import type { DbNullableIntegerNumberFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import type { DbUuidFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import { RawRelationRule } from "../../../domain/model/RelationRule";
import { RawRelationRuleField } from "../../../domain/model/RelationRule";
import { DbModel } from "../../../../shared/infrastructure/prisma/model/DbModel";
import { RelationRuleAbstractionId } from "../../../domain/model/RelationRule";
import { RelationRuleConceptId } from "../../../domain/model/RelationRule";
import { RelationRuleFixedOrder } from "../../../domain/model/RelationRule";
import { RelationRuleId } from "../../../domain/model/RelationRule";
import { RelationRuleIsActive } from "../../../domain/model/RelationRule";
import { RelationRuleMaxRelationNumber } from "../../../domain/model/RelationRule";
import { RelationRuleOperationId } from "../../../domain/model/RelationRule";
import { RelationRulePropertyId } from "../../../domain/model/RelationRule";
import { RelationRuleTransactionDate } from "../../../domain/model/RelationRule";
import { RelationRuleTransactionId } from "../../../domain/model/RelationRule";
import { RelationRuleUniquePerBranch } from "../../../domain/model/RelationRule";
import { RelationRuleUniquePerConcept } from "../../../domain/model/RelationRule";

type DbRawRelationRuleFilter =
    | { concept_id: DbUuidFilter }
    | { concept_id_abstraction: DbUuidFilter }
    | { concept_id_property: DbUuidFilter }
    | { fixed_order: DbBooleanFilter }
    | { id: DbUuidFilter }
    | { is_active: DbBooleanFilter }
    | { max_relation_number: DbNullableIntegerNumberFilter }
    | { operation_concept_id: DbUuidFilter }
    | { transaction_concept_id: DbUuidFilter }
    | { transaction_date: DbDateTimeFilter }
    | { unique_per_branch: DbBooleanFilter }
    | { unique_per_concept: DbBooleanFilter };

type DbRawRelationRuleFieldOrder =
    | { concept_id: DbFieldOrderDirection }
    | { concept_id_abstraction: DbFieldOrderDirection }
    | { concept_id_property: DbFieldOrderDirection }
    | { fixed_order: DbFieldOrderDirection }
    | { id: DbFieldOrderDirection }
    | { is_active: DbFieldOrderDirection }
    | { max_relation_number: DbFieldOrderDirection }
    | { operation_concept_id: DbFieldOrderDirection }
    | { transaction_concept_id: DbFieldOrderDirection }
    | { transaction_date: DbFieldOrderDirection }
    | { unique_per_branch: DbFieldOrderDirection }
    | { unique_per_concept: DbFieldOrderDirection };

export class DbRawRelationRule {
    concept_id: string;
    concept_id_abstraction: string;
    concept_id_property: string;
    fixed_order: boolean;
    id: string;
    is_active: boolean;
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
        is_active,
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
        is_active: boolean;
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
        this.is_active = is_active;
        this.max_relation_number = max_relation_number;
        this.operation_concept_id = operation_concept_id;
        this.transaction_concept_id = transaction_concept_id;
        this.transaction_date = transaction_date;
        this.unique_per_branch = unique_per_branch;
        this.unique_per_concept = unique_per_concept;
    }

    public static fromDomain(
        rawRelationRule: RawRelationRule,
    ): DbRawRelationRule {
        return new DbRawRelationRule({
            concept_id: rawRelationRule.conceptId.longValue,
            concept_id_abstraction: rawRelationRule.abstractionId.longValue,
            concept_id_property: rawRelationRule.propertyId.longValue,
            fixed_order: rawRelationRule.fixedOrder.value,
            id: rawRelationRule.id.longValue,
            is_active: rawRelationRule.isActive.value,
            max_relation_number:
                null == rawRelationRule.maxRelationNumber
                    ? null
                    : rawRelationRule.maxRelationNumber.value,
            operation_concept_id: rawRelationRule.operationId.longValue,
            transaction_concept_id: rawRelationRule.transactionId.longValue,
            transaction_date: rawRelationRule.transactionDate.value,
            unique_per_branch: rawRelationRule.uniquePerBranch.value,
            unique_per_concept: rawRelationRule.uniquePerConcept.value,
        });
    }

    public static toDbFilter(
        filter: RawRelationRuleFilter,
    ): DbRawRelationRuleFilter {
        switch (filter.field) {
            case RawRelationRuleField.ConceptId: {
                return {
                    concept_id: DbModel.toDbUuidFilter(filter.filter),
                };
            }
            case RawRelationRuleField.AbstractionId: {
                return {
                    concept_id_abstraction: DbModel.toDbUuidFilter(
                        filter.filter,
                    ),
                };
            }
            case RawRelationRuleField.PropertyId: {
                return {
                    concept_id_property: DbModel.toDbUuidFilter(filter.filter),
                };
            }
            case RawRelationRuleField.FixedOrder: {
                return {
                    fixed_order: DbModel.toDbBooleanFilter(filter.filter),
                };
            }
            case RawRelationRuleField.Id: {
                return {
                    id: DbModel.toDbUuidFilter(filter.filter),
                };
            }
            case RawRelationRuleField.IsActive: {
                return {
                    is_active: DbModel.toDbBooleanFilter(filter.filter),
                };
            }
            case RawRelationRuleField.MaxRelationNumber: {
                return {
                    max_relation_number:
                        DbModel.toDbNullableIntegerNumberFilter(filter.filter),
                };
            }
            case RawRelationRuleField.OperationId: {
                return {
                    operation_concept_id: DbModel.toDbUuidFilter(filter.filter),
                };
            }
            case RawRelationRuleField.TransactionDate: {
                return {
                    transaction_date: DbModel.toDbDateTimeFilter(filter.filter),
                };
            }
            case RawRelationRuleField.TransactionId: {
                return {
                    transaction_concept_id: DbModel.toDbUuidFilter(
                        filter.filter,
                    ),
                };
            }
            case RawRelationRuleField.UniquePerBranch: {
                return {
                    unique_per_branch: DbModel.toDbBooleanFilter(filter.filter),
                };
            }
            case RawRelationRuleField.UniquePerConcept: {
                return {
                    unique_per_concept: DbModel.toDbBooleanFilter(
                        filter.filter,
                    ),
                };
            }
        }
    }

    public static toDbFilterWhere(filters: RawRelationRuleFilter[]): {
        AND: DbRawRelationRuleFilter[];
    } {
        const dbFilters = filters.map((f) => DbRawRelationRule.toDbFilter(f));
        return { AND: dbFilters };
    }

    public static toDbOrder(
        order: RawRelationRuleFieldOrder,
    ): DbRawRelationRuleFieldOrder {
        switch (order.field) {
            case RawRelationRuleField.ConceptId: {
                return {
                    concept_id: DbModel.toDbOrderDirection(order.direction),
                };
            }
            case RawRelationRuleField.AbstractionId: {
                return {
                    concept_id_abstraction: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case RawRelationRuleField.PropertyId: {
                return {
                    concept_id_property: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case RawRelationRuleField.FixedOrder: {
                return {
                    fixed_order: DbModel.toDbOrderDirection(order.direction),
                };
            }
            case RawRelationRuleField.Id: {
                return {
                    id: DbModel.toDbOrderDirection(order.direction),
                };
            }
            case RawRelationRuleField.IsActive: {
                return {
                    is_active: DbModel.toDbOrderDirection(order.direction),
                };
            }
            case RawRelationRuleField.MaxRelationNumber: {
                return {
                    max_relation_number: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case RawRelationRuleField.OperationId: {
                return {
                    operation_concept_id: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case RawRelationRuleField.TransactionDate: {
                return {
                    transaction_date: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case RawRelationRuleField.TransactionId: {
                return {
                    transaction_concept_id: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case RawRelationRuleField.UniquePerBranch: {
                return {
                    unique_per_branch: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case RawRelationRuleField.UniquePerConcept: {
                return {
                    unique_per_concept: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
        }
    }

    public static toDbOrderBy(
        orderBy: RawRelationRuleFieldOrder[],
    ): DbRawRelationRuleFieldOrder[] {
        const dbOrderBy = orderBy.map((o) => DbRawRelationRule.toDbOrder(o));
        return dbOrderBy;
    }

    public toDomain(): RawRelationRule {
        return new RawRelationRule({
            abstractionId: new RelationRuleAbstractionId(
                this.concept_id_abstraction,
            ),
            conceptId: new RelationRuleConceptId(this.concept_id),
            fixedOrder: new RelationRuleFixedOrder(this.fixed_order),
            id: new RelationRuleId(this.id),
            isActive: new RelationRuleIsActive(this.is_active),
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
