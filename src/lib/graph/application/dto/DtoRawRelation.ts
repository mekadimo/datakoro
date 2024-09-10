import { RawRelation } from "../../domain/model/Relation";
import { RelationAbstractionId } from "../../domain/model/Relation";
import { RelationConceptId } from "../../domain/model/Relation";
import { RelationId } from "../../domain/model/Relation";
import { RelationIsActive } from "../../domain/model/Relation";
import { RelationOperationId } from "../../domain/model/Relation";
import { RelationOrderNumber } from "../../domain/model/Relation";
import { RelationPropertyId } from "../../domain/model/Relation";
import { RelationQualityId } from "../../domain/model/Relation";
import { RelationQualityTypeId } from "../../domain/model/Relation";
import { RelationSourceConceptId } from "../../domain/model/Relation";
import { RelationSourceRelationId } from "../../domain/model/Relation";
import { RelationTransactionDate } from "../../domain/model/Relation";
import { RelationTransactionId } from "../../domain/model/Relation";

export interface DtoRawRelation {
    readonly abstractionId: string;
    readonly conceptId: string;
    readonly id: string;
    readonly isActive: boolean;
    readonly operationId: string;
    readonly orderNumber: bigint;
    readonly propertyId: string;
    readonly qualityId: string;
    readonly qualityTypeId: string;
    readonly sourceConceptId: string;
    readonly sourceRelationId: string;
    readonly transactionDate: Date;
    readonly transactionId: string;
}

export class DtoRawRelationTransformer {
    public static fromDomain(rawRelation: RawRelation): DtoRawRelation {
        return {
            abstractionId: rawRelation.abstractionId.shortValue,
            conceptId: rawRelation.conceptId.shortValue,
            id: rawRelation.id.shortValue,
            isActive: rawRelation.isActive.value,
            operationId: rawRelation.operationId.shortValue,
            orderNumber: rawRelation.orderNumber.value,
            propertyId: rawRelation.propertyId.shortValue,
            qualityId: rawRelation.qualityId.shortValue,
            qualityTypeId: rawRelation.qualityTypeId.shortValue,
            sourceConceptId: rawRelation.sourceConceptId.shortValue,
            sourceRelationId: rawRelation.sourceRelationId.shortValue,
            transactionDate: rawRelation.transactionDate.value,
            transactionId: rawRelation.transactionId.shortValue,
        };
    }

    public static toDomain(dto: DtoRawRelation): RawRelation {
        return new RawRelation({
            abstractionId: new RelationAbstractionId(dto.abstractionId),
            conceptId: new RelationConceptId(dto.conceptId),
            id: new RelationId(dto.id),
            isActive: new RelationIsActive(dto.isActive),
            operationId: new RelationOperationId(dto.operationId),
            orderNumber: new RelationOrderNumber(dto.orderNumber),
            propertyId: new RelationPropertyId(dto.propertyId),
            qualityId: new RelationQualityId(dto.qualityId),
            qualityTypeId: new RelationQualityTypeId(dto.qualityTypeId),
            sourceConceptId: new RelationSourceConceptId(dto.sourceConceptId),
            sourceRelationId: new RelationSourceRelationId(
                dto.sourceRelationId,
            ),
            transactionDate: new RelationTransactionDate(dto.transactionDate),
            transactionId: new RelationTransactionId(dto.transactionId),
        });
    }
}
