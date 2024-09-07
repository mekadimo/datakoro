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
import { RelationPropertyId } from "../../../domain/model/Relation";
import { RelationQualityId } from "../../../domain/model/Relation";
import { RelationQualityTypeId } from "../../../domain/model/Relation";
import { RelationSourceConceptId } from "../../../domain/model/Relation";
import { RelationSourceRelationId } from "../../../domain/model/Relation";
import { RelationTransactionDate } from "../../../domain/model/Relation";
import { RelationTransactionId } from "../../../domain/model/Relation";

type DbRawRelationFilter =
    | { concept_id_abstraction: DbUuidFilter }
    | { concept_id_concept: DbUuidFilter }
    | { concept_id_property: DbUuidFilter }
    | { concept_id_quality: DbUuidFilter }
    | { concept_id_quality_type: DbUuidFilter }
    | { concept_id_source: DbUuidFilter }
    | { id: DbUuidFilter }
    | { is_active: DbBooleanFilter }
    | { operation_concept_id: DbUuidFilter }
    | { order_number: DbIntegerNumberFilter }
    | { relation_id_source: DbUuidFilter }
    | { transaction_concept_id: DbUuidFilter }
    | { transaction_date: DbDateTimeFilter };

type DbRawRelationFieldOrder =
    | { concept_id_abstraction: DbFieldOrderDirection }
    | { concept_id_concept: DbFieldOrderDirection }
    | { concept_id_property: DbFieldOrderDirection }
    | { concept_id_quality: DbFieldOrderDirection }
    | { concept_id_quality_type: DbFieldOrderDirection }
    | { concept_id_source: DbFieldOrderDirection }
    | { id: DbFieldOrderDirection }
    | { is_active: DbFieldOrderDirection }
    | { operation_concept_id: DbFieldOrderDirection }
    | { order_number: DbFieldOrderDirection }
    | { relation_id_source: DbFieldOrderDirection }
    | { transaction_concept_id: DbFieldOrderDirection }
    | { transaction_date: DbFieldOrderDirection };

export class DbRawRelation {
    concept_id_abstraction: string;
    concept_id_concept: string;
    concept_id_property: string;
    concept_id_quality: string;
    concept_id_quality_type: string;
    concept_id_source: string;
    id: string;
    is_active: boolean;
    operation_concept_id: string;
    order_number: bigint;
    relation_id_source: string;
    transaction_concept_id: string;
    transaction_date: Date;

    constructor({
        concept_id_abstraction,
        concept_id_concept,
        concept_id_property,
        concept_id_quality,
        concept_id_quality_type,
        concept_id_source,
        id,
        is_active,
        operation_concept_id,
        order_number,
        relation_id_source,
        transaction_concept_id,
        transaction_date,
    }: {
        concept_id_abstraction: string;
        concept_id_concept: string;
        concept_id_property: string;
        concept_id_quality: string;
        concept_id_quality_type: string;
        concept_id_source: string;
        id: string;
        is_active: boolean;
        operation_concept_id: string;
        order_number: bigint;
        relation_id_source: string;
        transaction_concept_id: string;
        transaction_date: Date;
    }) {
        this.concept_id_abstraction = concept_id_abstraction;
        this.concept_id_concept = concept_id_concept;
        this.concept_id_property = concept_id_property;
        this.concept_id_quality = concept_id_quality;
        this.concept_id_quality_type = concept_id_quality_type;
        this.concept_id_source = concept_id_source;
        this.id = id;
        this.is_active = is_active;
        this.operation_concept_id = operation_concept_id;
        this.order_number = order_number;
        this.relation_id_source = relation_id_source;
        this.transaction_concept_id = transaction_concept_id;
        this.transaction_date = transaction_date;
    }

    public static fromDomain(rawRelation: RawRelation): DbRawRelation {
        return new DbRawRelation({
            concept_id_abstraction: rawRelation.abstractionId.longValue,
            concept_id_concept: rawRelation.conceptId.longValue,
            concept_id_property: rawRelation.propertyId.longValue,
            concept_id_quality: rawRelation.qualityId.longValue,
            concept_id_quality_type: rawRelation.qualityTypeId.longValue,
            concept_id_source: rawRelation.sourceConceptId.longValue,
            id: rawRelation.id.longValue,
            is_active: rawRelation.isActive.value,
            operation_concept_id: rawRelation.operationId.longValue,
            order_number: rawRelation.orderNumber.value,
            relation_id_source: rawRelation.sourceRelationId.longValue,
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
            case RawRelationField.SourceConceptId: {
                return {
                    concept_id_source: DbModel.toDbUuidFilter(filter.filter),
                };
            }
            case RawRelationField.SourceRelationId: {
                return {
                    relation_id_source: DbModel.toDbUuidFilter(filter.filter),
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
            case RawRelationField.SourceConceptId: {
                return {
                    concept_id_source: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case RawRelationField.SourceRelationId: {
                return {
                    relation_id_source: DbModel.toDbOrderDirection(
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
            propertyId: new RelationPropertyId(this.concept_id_property),
            qualityId: new RelationQualityId(this.concept_id_quality),
            qualityTypeId: new RelationQualityTypeId(
                this.concept_id_quality_type,
            ),
            sourceConceptId: new RelationSourceConceptId(
                this.concept_id_source,
            ),
            sourceRelationId: new RelationSourceRelationId(
                this.relation_id_source,
            ),
            transactionDate: new RelationTransactionDate(this.transaction_date),
            transactionId: new RelationTransactionId(
                this.transaction_concept_id,
            ),
        });
    }
}
