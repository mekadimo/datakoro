import { ActiveRelation } from "../../domain/model/Relation";
import { RelationAbstractionId } from "../../domain/model/Relation";
import { RelationConceptId } from "../../domain/model/Relation";
import { RelationId } from "../../domain/model/Relation";
import { RelationOperationId } from "../../domain/model/Relation";
import { RelationOrderNumber } from "../../domain/model/Relation";
import { RelationPropertyId } from "../../domain/model/Relation";
import { RelationQualityId } from "../../domain/model/Relation";
import { RelationQualityTypeId } from "../../domain/model/Relation";
import { RelationSourceConceptId } from "../../domain/model/Relation";
import { RelationSourceRelationId } from "../../domain/model/Relation";
import { RelationTransactionDate } from "../../domain/model/Relation";
import { RelationTransactionId } from "../../domain/model/Relation";

export interface DtoActiveRelation {
    readonly abstractionId: string;
    readonly conceptId: string;
    readonly id: string;
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

export class DtoActiveRelationTransformer {
    public static fromDomain(
        activeRelation: ActiveRelation,
    ): DtoActiveRelation {
        return {
            abstractionId: activeRelation.abstractionId.shortValue,
            conceptId: activeRelation.conceptId.shortValue,
            id: activeRelation.id.shortValue,
            operationId: activeRelation.operationId.shortValue,
            orderNumber: activeRelation.orderNumber.value,
            propertyId: activeRelation.propertyId.shortValue,
            qualityId: activeRelation.qualityId.shortValue,
            qualityTypeId: activeRelation.qualityTypeId.shortValue,
            sourceConceptId: activeRelation.sourceConceptId.shortValue,
            sourceRelationId: activeRelation.sourceRelationId.shortValue,
            transactionDate: activeRelation.transactionDate.value,
            transactionId: activeRelation.transactionId.shortValue,
        };
    }

    public static toDomain(dto: DtoActiveRelation): ActiveRelation {
        return new ActiveRelation({
            abstractionId: new RelationAbstractionId(dto.abstractionId),
            conceptId: new RelationConceptId(dto.conceptId),
            id: new RelationId(dto.id),
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
