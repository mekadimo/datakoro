import type { DbBooleanFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import type { DbDateTimeFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import type { DbFieldOrderDirection } from "../../../../shared/infrastructure/prisma/model/DbFieldOrderDirection";
import type { DbIntegerNumberFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import type { DbUuidFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import type { RawRelationFieldOrder } from "../../../domain/model/Relation";
import type { RawRelationFilter } from "../../../domain/model/Relation";
import { DbModel } from "../../../../shared/infrastructure/prisma/model/DbModel";
import { RawRelation } from "../../../domain/model/Relation";
import { RawRelationField } from "../../../domain/model/Relation";
import { RelationAbstractionId } from "../../../domain/model/Relation";
import { RelationConceptId } from "../../../domain/model/Relation";
import { RelationId } from "../../../domain/model/Relation";
import { RelationIsActive } from "../../../domain/model/Relation";
import { RelationOperationId } from "../../../domain/model/Relation";
import { RelationOrderNumber } from "../../../domain/model/Relation";
import { RelationOriginConceptId } from "../../../domain/model/Relation";
import { RelationOriginRelationId } from "../../../domain/model/Relation";
import { RelationPropertyId } from "../../../domain/model/Relation";
import { RelationQualityId } from "../../../domain/model/Relation";
import { RelationQualityTypeId } from "../../../domain/model/Relation";
import { RelationTransactionDate } from "../../../domain/model/Relation";
import { RelationTransactionId } from "../../../domain/model/Relation";

type DbRawRelationFilter =
    | { concept_id_abstraction: DbUuidFilter }
    | { concept_id_concept: DbUuidFilter }
    | { concept_id_origin: DbUuidFilter }
    | { concept_id_property: DbUuidFilter }
    | { concept_id_quality: DbUuidFilter }
    | { concept_id_quality_type: DbUuidFilter }
    | { id: DbUuidFilter }
    | { is_active: DbBooleanFilter }
    | { operation_concept_id: DbUuidFilter }
    | { order_number: DbIntegerNumberFilter }
    | { relation_id_origin: DbUuidFilter }
    | { transaction_concept_id: DbUuidFilter }
    | { transaction_date: DbDateTimeFilter };

type DbRawRelationFieldOrder =
    | { concept_id_abstraction: DbFieldOrderDirection }
    | { concept_id_concept: DbFieldOrderDirection }
    | { concept_id_origin: DbFieldOrderDirection }
    | { concept_id_property: DbFieldOrderDirection }
    | { concept_id_quality: DbFieldOrderDirection }
    | { concept_id_quality_type: DbFieldOrderDirection }
    | { id: DbFieldOrderDirection }
    | { is_active: DbFieldOrderDirection }
    | { operation_concept_id: DbFieldOrderDirection }
    | { order_number: DbFieldOrderDirection }
    | { relation_id_origin: DbFieldOrderDirection }
    | { transaction_concept_id: DbFieldOrderDirection }
    | { transaction_date: DbFieldOrderDirection };

export class DbRawRelation {
    concept_id_abstraction: string;
    concept_id_concept: string;
    concept_id_origin: string;
    concept_id_property: string;
    concept_id_quality: string;
    concept_id_quality_type: string;
    id: string;
    is_active: boolean;
    operation_concept_id: string;
    order_number: bigint;
    relation_id_origin: string;
    transaction_concept_id: string;
    transaction_date: Date;

    constructor(input: {
        concept_id_abstraction: string;
        concept_id_concept: string;
        concept_id_origin: string;
        concept_id_property: string;
        concept_id_quality: string;
        concept_id_quality_type: string;
        id: string;
        is_active: boolean;
        operation_concept_id: string;
        order_number: bigint;
        relation_id_origin: string;
        transaction_concept_id: string;
        transaction_date: Date;
    }) {
        this.concept_id_abstraction = input.concept_id_abstraction;
        this.concept_id_concept = input.concept_id_concept;
        this.concept_id_origin = input.concept_id_origin;
        this.concept_id_property = input.concept_id_property;
        this.concept_id_quality = input.concept_id_quality;
        this.concept_id_quality_type = input.concept_id_quality_type;
        this.id = input.id;
        this.is_active = input.is_active;
        this.operation_concept_id = input.operation_concept_id;
        this.order_number = input.order_number;
        this.relation_id_origin = input.relation_id_origin;
        this.transaction_concept_id = input.transaction_concept_id;
        this.transaction_date = input.transaction_date;
    }

    public static fromDomain(rawRelation: RawRelation): DbRawRelation {
        return new DbRawRelation({
            concept_id_abstraction: rawRelation.abstractionId.longValue,
            concept_id_concept: rawRelation.conceptId.longValue,
            concept_id_origin: rawRelation.originConceptId.longValue,
            concept_id_property: rawRelation.propertyId.longValue,
            concept_id_quality: rawRelation.qualityId.longValue,
            concept_id_quality_type: rawRelation.qualityTypeId.longValue,
            id: rawRelation.id.longValue,
            is_active: rawRelation.isActive.value,
            operation_concept_id: rawRelation.operationId.longValue,
            order_number: rawRelation.orderNumber.value,
            relation_id_origin: rawRelation.originRelationId.longValue,
            transaction_concept_id: rawRelation.transactionId.longValue,
            transaction_date: rawRelation.transactionDate.value,
        });
    }

    public static toDbFilter(filter: RawRelationFilter): DbRawRelationFilter {
        switch (filter.field) {
            case RawRelationField.AbstractionId: {
                return {
                    concept_id_abstraction: DbModel.toDbUuidFilter(
                        filter.filter,
                    ),
                };
            }
            case RawRelationField.ConceptId: {
                return {
                    concept_id_concept: DbModel.toDbUuidFilter(filter.filter),
                };
            }
            case RawRelationField.Id: {
                return {
                    id: DbModel.toDbUuidFilter(filter.filter),
                };
            }
            case RawRelationField.IsActive: {
                return {
                    is_active: DbModel.toDbBooleanFilter(filter.filter),
                };
            }
            case RawRelationField.OperationId: {
                return {
                    operation_concept_id: DbModel.toDbUuidFilter(filter.filter),
                };
            }
            case RawRelationField.OrderNumber: {
                return {
                    order_number: DbModel.toDbIntegerNumberFilter(
                        filter.filter,
                    ),
                };
            }
            case RawRelationField.OriginConceptId: {
                return {
                    concept_id_origin: DbModel.toDbUuidFilter(filter.filter),
                };
            }
            case RawRelationField.OriginRelationId: {
                return {
                    relation_id_origin: DbModel.toDbUuidFilter(filter.filter),
                };
            }
            case RawRelationField.PropertyId: {
                return {
                    concept_id_property: DbModel.toDbUuidFilter(filter.filter),
                };
            }
            case RawRelationField.QualityId: {
                return {
                    concept_id_quality: DbModel.toDbUuidFilter(filter.filter),
                };
            }
            case RawRelationField.QualityTypeId: {
                return {
                    concept_id_quality_type: DbModel.toDbUuidFilter(
                        filter.filter,
                    ),
                };
            }
            case RawRelationField.TransactionDate: {
                return {
                    transaction_date: DbModel.toDbDateTimeFilter(filter.filter),
                };
            }
            case RawRelationField.TransactionId: {
                return {
                    transaction_concept_id: DbModel.toDbUuidFilter(
                        filter.filter,
                    ),
                };
            }
        }
    }

    public static toDbFilterWhere(filters: RawRelationFilter[]): {
        AND: DbRawRelationFilter[];
    } {
        const dbFilters = filters.map((f) => DbRawRelation.toDbFilter(f));
        return { AND: dbFilters };
    }

    public static toDbOrder(
        order: RawRelationFieldOrder,
    ): DbRawRelationFieldOrder {
        switch (order.field) {
            case RawRelationField.AbstractionId: {
                return {
                    concept_id_abstraction: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case RawRelationField.ConceptId: {
                return {
                    concept_id_concept: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case RawRelationField.Id: {
                return {
                    id: DbModel.toDbOrderDirection(order.direction),
                };
            }
            case RawRelationField.IsActive: {
                return {
                    is_active: DbModel.toDbOrderDirection(order.direction),
                };
            }
            case RawRelationField.OperationId: {
                return {
                    operation_concept_id: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case RawRelationField.OrderNumber: {
                return {
                    order_number: DbModel.toDbOrderDirection(order.direction),
                };
            }
            case RawRelationField.OriginConceptId: {
                return {
                    concept_id_origin: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case RawRelationField.OriginRelationId: {
                return {
                    relation_id_origin: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case RawRelationField.PropertyId: {
                return {
                    concept_id_property: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case RawRelationField.QualityId: {
                return {
                    concept_id_quality: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case RawRelationField.QualityTypeId: {
                return {
                    concept_id_quality_type: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case RawRelationField.TransactionDate: {
                return {
                    transaction_date: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case RawRelationField.TransactionId: {
                return {
                    transaction_concept_id: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
        }
    }

    public static toDbOrderBy(
        orderBy: RawRelationFieldOrder[],
    ): DbRawRelationFieldOrder[] {
        const dbOrderBy = orderBy.map((o) => DbRawRelation.toDbOrder(o));
        return dbOrderBy;
    }

    public toDomain(): RawRelation {
        return new RawRelation({
            abstractionId: new RelationAbstractionId(
                this.concept_id_abstraction,
            ),
            conceptId: new RelationConceptId(this.concept_id_concept),
            id: new RelationId(this.id),
            isActive: new RelationIsActive(this.is_active),
            operationId: new RelationOperationId(this.operation_concept_id),
            orderNumber: new RelationOrderNumber(this.order_number),
            originConceptId: new RelationOriginConceptId(
                this.concept_id_origin,
            ),
            originRelationId: new RelationOriginRelationId(
                this.relation_id_origin,
            ),
            propertyId: new RelationPropertyId(this.concept_id_property),
            qualityId: new RelationQualityId(this.concept_id_quality),
            qualityTypeId: new RelationQualityTypeId(
                this.concept_id_quality_type,
            ),
            transactionDate: new RelationTransactionDate(this.transaction_date),
            transactionId: new RelationTransactionId(
                this.transaction_concept_id,
            ),
        });
    }
}
