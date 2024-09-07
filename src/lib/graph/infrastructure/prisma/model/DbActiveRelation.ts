import type { ActiveRelationFieldOrder } from "../../../domain/model/Relation";
import type { ActiveRelationFilter } from "../../../domain/model/Relation";
import type { DbDateTimeFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import type { DbFieldOrderDirection } from "../../../../shared/infrastructure/prisma/model/DbFieldOrderDirection";
import type { DbIntegerNumberFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import type { DbUuidFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import { ActiveRelation } from "../../../domain/model/Relation";
import { ActiveRelationField } from "../../../domain/model/Relation";
import { DbModel } from "../../../../shared/infrastructure/prisma/model/DbModel";
import { RelationAbstractionId } from "../../../domain/model/Relation";
import { RelationConceptId } from "../../../domain/model/Relation";
import { RelationId } from "../../../domain/model/Relation";
import { RelationOperationId } from "../../../domain/model/Relation";
import { RelationOrderNumber } from "../../../domain/model/Relation";
import { RelationPropertyId } from "../../../domain/model/Relation";
import { RelationQualityId } from "../../../domain/model/Relation";
import { RelationQualityTypeId } from "../../../domain/model/Relation";
import { RelationSourceConceptId } from "../../../domain/model/Relation";
import { RelationSourceRelationId } from "../../../domain/model/Relation";
import { RelationTransactionDate } from "../../../domain/model/Relation";
import { RelationTransactionId } from "../../../domain/model/Relation";

type DbActiveRelationFilter =
    | { concept_id_abstraction: DbUuidFilter }
    | { concept_id_concept: DbUuidFilter }
    | { concept_id_property: DbUuidFilter }
    | { concept_id_quality: DbUuidFilter }
    | { concept_id_quality_type: DbUuidFilter }
    | { concept_id_source: DbUuidFilter }
    | { id: DbUuidFilter }
    | { operation_concept_id: DbUuidFilter }
    | { order_number: DbIntegerNumberFilter }
    | { relation_id_source: DbUuidFilter }
    | { transaction_concept_id: DbUuidFilter }
    | { transaction_date: DbDateTimeFilter };

type DbActiveRelationFieldOrder =
    | { concept_id_abstraction: DbFieldOrderDirection }
    | { concept_id_concept: DbFieldOrderDirection }
    | { concept_id_property: DbFieldOrderDirection }
    | { concept_id_quality: DbFieldOrderDirection }
    | { concept_id_quality_type: DbFieldOrderDirection }
    | { concept_id_source: DbFieldOrderDirection }
    | { id: DbFieldOrderDirection }
    | { operation_concept_id: DbFieldOrderDirection }
    | { order_number: DbFieldOrderDirection }
    | { relation_id_source: DbFieldOrderDirection }
    | { transaction_concept_id: DbFieldOrderDirection }
    | { transaction_date: DbFieldOrderDirection };

export class DbActiveRelation {
    concept_id_abstraction: string;
    concept_id_concept: string;
    concept_id_property: string;
    concept_id_quality: string;
    concept_id_quality_type: string;
    concept_id_source: string;
    id: string;
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
        this.operation_concept_id = operation_concept_id;
        this.order_number = order_number;
        this.relation_id_source = relation_id_source;
        this.transaction_concept_id = transaction_concept_id;
        this.transaction_date = transaction_date;
    }

    public static fromDomain(activeRelation: ActiveRelation): DbActiveRelation {
        return new DbActiveRelation({
            concept_id_abstraction: activeRelation.abstractionId.longValue,
            concept_id_concept: activeRelation.conceptId.longValue,
            concept_id_property: activeRelation.propertyId.longValue,
            concept_id_quality: activeRelation.qualityId.longValue,
            concept_id_quality_type: activeRelation.qualityTypeId.longValue,
            concept_id_source: activeRelation.sourceConceptId.longValue,
            id: activeRelation.id.longValue,
            operation_concept_id: activeRelation.operationId.longValue,
            order_number: activeRelation.orderNumber.value,
            relation_id_source: activeRelation.sourceRelationId.longValue,
            transaction_concept_id: activeRelation.transactionId.longValue,
            transaction_date: activeRelation.transactionDate.value,
        });
    }

    public static toDbFilter(
        filter: ActiveRelationFilter,
    ): DbActiveRelationFilter {
        switch (filter.field) {
            case ActiveRelationField.AbstractionId: {
                return {
                    concept_id_abstraction: DbModel.toDbUuidFilter(
                        filter.filter,
                    ),
                };
            }
            case ActiveRelationField.ConceptId: {
                return {
                    concept_id_concept: DbModel.toDbUuidFilter(filter.filter),
                };
            }
            case ActiveRelationField.Id: {
                return {
                    id: DbModel.toDbUuidFilter(filter.filter),
                };
            }
            case ActiveRelationField.OperationId: {
                return {
                    operation_concept_id: DbModel.toDbUuidFilter(filter.filter),
                };
            }
            case ActiveRelationField.OrderNumber: {
                return {
                    order_number: DbModel.toDbIntegerNumberFilter(
                        filter.filter,
                    ),
                };
            }
            case ActiveRelationField.PropertyId: {
                return {
                    concept_id_property: DbModel.toDbUuidFilter(filter.filter),
                };
            }
            case ActiveRelationField.QualityId: {
                return {
                    concept_id_quality: DbModel.toDbUuidFilter(filter.filter),
                };
            }
            case ActiveRelationField.QualityTypeId: {
                return {
                    concept_id_quality_type: DbModel.toDbUuidFilter(
                        filter.filter,
                    ),
                };
            }
            case ActiveRelationField.SourceConceptId: {
                return {
                    concept_id_source: DbModel.toDbUuidFilter(filter.filter),
                };
            }
            case ActiveRelationField.SourceRelationId: {
                return {
                    relation_id_source: DbModel.toDbUuidFilter(filter.filter),
                };
            }
            case ActiveRelationField.TransactionDate: {
                return {
                    transaction_date: DbModel.toDbDateTimeFilter(filter.filter),
                };
            }
            case ActiveRelationField.TransactionId: {
                return {
                    transaction_concept_id: DbModel.toDbUuidFilter(
                        filter.filter,
                    ),
                };
            }
        }
    }

    public static toDbFilterWhere(filters: ActiveRelationFilter[]): {
        AND: DbActiveRelationFilter[];
    } {
        const dbFilters = filters.map((f) => DbActiveRelation.toDbFilter(f));
        return { AND: dbFilters };
    }

    public static toDbOrder(
        order: ActiveRelationFieldOrder,
    ): DbActiveRelationFieldOrder {
        switch (order.field) {
            case ActiveRelationField.AbstractionId: {
                return {
                    concept_id_abstraction: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case ActiveRelationField.ConceptId: {
                return {
                    concept_id_concept: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case ActiveRelationField.Id: {
                return {
                    id: DbModel.toDbOrderDirection(order.direction),
                };
            }
            case ActiveRelationField.OperationId: {
                return {
                    operation_concept_id: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case ActiveRelationField.OrderNumber: {
                return {
                    order_number: DbModel.toDbOrderDirection(order.direction),
                };
            }
            case ActiveRelationField.PropertyId: {
                return {
                    concept_id_property: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case ActiveRelationField.QualityId: {
                return {
                    concept_id_quality: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case ActiveRelationField.QualityTypeId: {
                return {
                    concept_id_quality_type: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case ActiveRelationField.SourceConceptId: {
                return {
                    concept_id_source: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case ActiveRelationField.SourceRelationId: {
                return {
                    relation_id_source: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case ActiveRelationField.TransactionDate: {
                return {
                    transaction_date: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case ActiveRelationField.TransactionId: {
                return {
                    transaction_concept_id: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
        }
    }

    public static toDbOrderBy(
        orderBy: ActiveRelationFieldOrder[],
    ): DbActiveRelationFieldOrder[] {
        const dbOrderBy = orderBy.map((o) => DbActiveRelation.toDbOrder(o));
        return dbOrderBy;
    }

    public toDomain(): ActiveRelation {
        return new ActiveRelation({
            abstractionId: new RelationAbstractionId(
                this.concept_id_abstraction,
            ),
            conceptId: new RelationConceptId(this.concept_id_concept),
            id: new RelationId(this.id),
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
