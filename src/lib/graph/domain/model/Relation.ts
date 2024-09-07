import type { BooleanFilter } from "../../../shared/domain/model/Filter";
import type { DateTimeFilter } from "../../../shared/domain/model/Filter";
import type { FieldOrder } from "../../../shared/domain/model/FieldOrder";
import type { IntegerNumberFilter } from "../../../shared/domain/model/Filter";
import type { SearchCriteria } from "../../../shared/domain/model/SearchCriteria";
import type { UuidFilter } from "../../../shared/domain/model/Filter";
import { BooleanValueObject } from "../../../shared/domain/model/ValueObject";
import { CannotDeleteInheritedRelationException } from "../../../shared/domain/model/DomainException";
import { ConceptId } from "./ConceptId";
import { ID_ABSTRACTION } from "./ConceptId";
import { ID_CONCEPT } from "./ConceptId";
import { OperationConceptId } from "../../../operation/domain/model/OperationConcept";
import { PositiveNonZeroIntegerNumberValueObject } from "../../../shared/domain/model/ValueObject";
import { TransactionConceptDate } from "../../../operation/domain/model/TransactionConceptDate";
import { TransactionConceptId } from "../../../operation/domain/model/TransactionConcept";
import { UuidValueObject } from "../../../shared/domain/model/ValueObject";

export class ActiveRelation {
    readonly abstractionId: RelationAbstractionId;
    readonly conceptId: RelationConceptId;
    readonly id: RelationId;
    readonly operationId: RelationOperationId;
    readonly orderNumber: RelationOrderNumber;
    readonly propertyId: RelationPropertyId;
    readonly qualityId: RelationQualityId;
    readonly qualityTypeId: RelationQualityTypeId;
    readonly sourceConceptId: RelationSourceConceptId;
    readonly sourceRelationId: RelationSourceRelationId;
    readonly transactionDate: RelationTransactionDate;
    readonly transactionId: RelationTransactionId;

    constructor({
        abstractionId,
        conceptId,
        id,
        operationId,
        orderNumber,
        propertyId,
        qualityId,
        qualityTypeId,
        sourceConceptId,
        sourceRelationId,
        transactionDate,
        transactionId,
    }: {
        abstractionId: RelationAbstractionId;
        conceptId: RelationConceptId;
        id: RelationId;
        operationId: RelationOperationId;
        orderNumber: RelationOrderNumber;
        propertyId: RelationPropertyId;
        qualityId: RelationQualityId;
        qualityTypeId: RelationQualityTypeId;
        sourceConceptId: RelationSourceConceptId;
        sourceRelationId: RelationSourceRelationId;
        transactionDate: RelationTransactionDate;
        transactionId: RelationTransactionId;
    }) {
        this.abstractionId = abstractionId;
        this.conceptId = conceptId;
        this.id = id;
        this.operationId = operationId;
        this.orderNumber = orderNumber;
        this.propertyId = propertyId;
        this.qualityId = qualityId;
        this.qualityTypeId = qualityTypeId;
        this.sourceConceptId = sourceConceptId;
        this.sourceRelationId = sourceRelationId;
        this.transactionDate = transactionDate;
        this.transactionId = transactionId;
    }

    public static fromRaw(rawRelation: RawRelation): ActiveRelation {
        return new ActiveRelation({
            abstractionId: rawRelation.abstractionId,
            conceptId: rawRelation.conceptId,
            id: rawRelation.id,
            operationId: rawRelation.operationId,
            orderNumber: rawRelation.orderNumber,
            propertyId: rawRelation.propertyId,
            qualityId: rawRelation.qualityId,
            qualityTypeId: rawRelation.qualityTypeId,
            sourceConceptId: rawRelation.sourceConceptId,
            sourceRelationId: rawRelation.sourceRelationId,
            transactionDate: rawRelation.transactionDate,
            transactionId: rawRelation.transactionId,
        });
    }

    public toRaw(): RawRelation {
        return new RawRelation({
            abstractionId: this.abstractionId,
            conceptId: this.conceptId,
            id: this.id,
            isActive: new RelationIsActive(true),
            operationId: this.operationId,
            orderNumber: this.orderNumber,
            propertyId: this.propertyId,
            qualityId: this.qualityId,
            qualityTypeId: this.qualityTypeId,
            sourceConceptId: this.sourceConceptId,
            sourceRelationId: this.sourceRelationId,
            transactionDate: this.transactionDate,
            transactionId: this.transactionId,
        });
    }

    public get hasExtraData(): boolean {
        return this.qualityTypeId.longValue != ID_CONCEPT.longValue;
    }

    public get isAbstraction(): boolean {
        return (
            this.abstractionId.longValue === ID_ABSTRACTION.longValue &&
            this.propertyId.longValue === ID_ABSTRACTION.longValue
        );
    }

    public get isOriginal(): boolean {
        return this.id.longValue === this.sourceRelationId.longValue;
    }

    public updateOrder({
        operationConceptId,
        transactionConceptId,
        transactionConceptDate,
        orderNumber,
    }: {
        operationConceptId: OperationConceptId;
        transactionConceptId: TransactionConceptId;
        transactionConceptDate: TransactionConceptDate;
        orderNumber: RelationOrderNumber;
    }): RawRelation {
        const id = RelationId.generateRandom();

        const operationId = new RelationOperationId(
            operationConceptId.longValue,
        );
        const transactionId = new RelationTransactionId(
            transactionConceptId.longValue,
        );
        const transactionDate = new RelationTransactionDate(
            transactionConceptDate.value,
        );

        return new RawRelation({
            abstractionId: this.abstractionId,
            conceptId: this.conceptId,
            id: id,
            isActive: new RelationIsActive(true),
            operationId: operationId,
            orderNumber: orderNumber,
            propertyId: this.propertyId,
            qualityId: this.qualityId,
            qualityTypeId: this.qualityTypeId,
            sourceConceptId: this.sourceConceptId,
            sourceRelationId: this.sourceRelationId,
            transactionDate: transactionDate,
            transactionId: transactionId,
        });
    }
}

export enum ActiveRelationField {
    AbstractionId = "ActiveRelationField.AbstractionId",
    ConceptId = "ActiveRelationField.ConceptId",
    Id = "ActiveRelationField.Id",
    OperationId = "ActiveRelationField.OperationId",
    OrderNumber = "ActiveRelationField.OrderNumber",
    PropertyId = "ActiveRelationField.Propertyid",
    QualityId = "ActiveRelationField.QualityId",
    QualityTypeId = "ActiveRelationField.QualityTypeId",
    SourceConceptId = "ActiveRelationField.SourceConceptId",
    SourceRelationId = "ActiveRelationField.SourceRelationId",
    TransactionDate = "ActiveRelationField.TransactionDate",
    TransactionId = "ActiveRelationField.TransactionId",
}

export type ActiveRelationFieldOrder = FieldOrder<ActiveRelationField>;

export type ActiveRelationFilter =
    | { field: ActiveRelationField.AbstractionId; filter: UuidFilter }
    | { field: ActiveRelationField.ConceptId; filter: UuidFilter }
    | { field: ActiveRelationField.Id; filter: UuidFilter }
    | { field: ActiveRelationField.OperationId; filter: UuidFilter }
    | { field: ActiveRelationField.OrderNumber; filter: IntegerNumberFilter }
    | { field: ActiveRelationField.PropertyId; filter: UuidFilter }
    | { field: ActiveRelationField.QualityId; filter: UuidFilter }
    | { field: ActiveRelationField.QualityTypeId; filter: UuidFilter }
    | { field: ActiveRelationField.SourceConceptId; filter: UuidFilter }
    | { field: ActiveRelationField.SourceRelationId; filter: UuidFilter }
    | { field: ActiveRelationField.TransactionDate; filter: DateTimeFilter }
    | { field: ActiveRelationField.TransactionId; filter: UuidFilter };

export type ActiveRelationSearchCriteria = SearchCriteria<
    ActiveRelationFilter,
    ActiveRelationFieldOrder
>;

export class RawRelation {
    readonly abstractionId: RelationAbstractionId;
    readonly conceptId: RelationConceptId;
    readonly id: RelationId;
    readonly isActive: RelationIsActive;
    readonly operationId: RelationOperationId;
    readonly orderNumber: RelationOrderNumber;
    readonly propertyId: RelationPropertyId;
    readonly qualityId: RelationQualityId;
    readonly qualityTypeId: RelationQualityTypeId;
    readonly sourceConceptId: RelationSourceConceptId;
    readonly sourceRelationId: RelationSourceRelationId;
    readonly transactionDate: RelationTransactionDate;
    readonly transactionId: RelationTransactionId;

    constructor({
        abstractionId,
        conceptId,
        id,
        isActive,
        operationId,
        orderNumber,
        propertyId,
        qualityId,
        qualityTypeId,
        sourceConceptId,
        sourceRelationId,
        transactionDate,
        transactionId,
    }: {
        abstractionId: RelationAbstractionId;
        conceptId: RelationConceptId;
        id: RelationId;
        isActive: RelationIsActive;
        operationId: RelationOperationId;
        orderNumber: RelationOrderNumber;
        propertyId: RelationPropertyId;
        qualityId: RelationQualityId;
        qualityTypeId: RelationQualityTypeId;
        sourceConceptId: RelationSourceConceptId;
        sourceRelationId: RelationSourceRelationId;
        transactionDate: RelationTransactionDate;
        transactionId: RelationTransactionId;
    }) {
        this.abstractionId = abstractionId;
        this.conceptId = conceptId;
        this.id = id;
        this.isActive = isActive;
        this.operationId = operationId;
        this.orderNumber = orderNumber;
        this.propertyId = propertyId;
        this.qualityId = qualityId;
        this.qualityTypeId = qualityTypeId;
        this.sourceConceptId = sourceConceptId;
        this.sourceRelationId = sourceRelationId;
        this.transactionDate = transactionDate;
        this.transactionId = transactionId;
    }

    public static create({
        operationConceptId,
        transactionConceptId,
        transactionConceptDate,
        inputConceptId,
        inputAbstractionId,
        inputPropertyId,
        inputOrderNumber,
        inputQualityId,
        inputQualityTypeId,
    }: {
        operationConceptId: OperationConceptId;
        transactionConceptId: TransactionConceptId;
        transactionConceptDate: TransactionConceptDate;
        inputConceptId: ConceptId;
        inputAbstractionId: ConceptId;
        inputPropertyId: ConceptId;
        inputOrderNumber: RelationOrderNumber | null;
        inputQualityId: ConceptId;
        inputQualityTypeId: ConceptId;
    }): RawRelation {
        const id = RelationId.generateRandom();

        const conceptId = new RelationConceptId(inputConceptId.longValue);

        const abstractionId = new RelationAbstractionId(
            inputAbstractionId.longValue,
        );
        const propertyId = new RelationPropertyId(inputPropertyId.longValue);
        const qualityId = new RelationQualityId(inputQualityId.longValue);
        const qualityTypeId = new RelationQualityTypeId(
            inputQualityTypeId.longValue,
        );

        const sourceConceptId = new RelationSourceConceptId(
            conceptId.longValue,
        );
        const sourceRelationId = new RelationSourceConceptId(id.longValue);

        const operationId = new RelationOperationId(
            operationConceptId.longValue,
        );
        const transactionId = new RelationTransactionId(
            transactionConceptId.longValue,
        );
        const transactionDate = new RelationTransactionDate(
            transactionConceptDate.value,
        );

        return new RawRelation({
            abstractionId: abstractionId,
            conceptId: conceptId,
            id: id,
            isActive: new RelationIsActive(true),
            operationId: operationId,
            orderNumber: inputOrderNumber ?? new RelationOrderNumber(BigInt(1)),
            propertyId: propertyId,
            qualityId: qualityId,
            qualityTypeId: qualityTypeId,
            sourceConceptId: sourceConceptId,
            sourceRelationId: sourceRelationId,
            transactionDate: transactionDate,
            transactionId: transactionId,
        });
    }

    public static createInherited({
        operationConceptId,
        transactionConceptId,
        transactionConceptDate,
        inheritorConceptId,
        originalRelation,
    }: {
        operationConceptId: OperationConceptId;
        transactionConceptId: TransactionConceptId;
        transactionConceptDate: TransactionConceptDate;
        inheritorConceptId: ConceptId;
        originalRelation: RawRelation;
    }): RawRelation {
        const id = RelationId.generateRandom();

        const conceptId = new RelationConceptId(inheritorConceptId.longValue);

        const operationId = new RelationOperationId(
            operationConceptId.longValue,
        );
        const transactionId = new RelationTransactionId(
            transactionConceptId.longValue,
        );
        const transactionDate = new RelationTransactionDate(
            transactionConceptDate.value,
        );

        return new RawRelation({
            abstractionId: originalRelation.abstractionId,
            conceptId: conceptId,
            id: id,
            isActive: originalRelation.isActive,
            operationId: operationId,
            orderNumber: originalRelation.orderNumber,
            propertyId: originalRelation.propertyId,
            qualityId: originalRelation.qualityId,
            qualityTypeId: originalRelation.qualityTypeId,
            sourceConceptId: originalRelation.sourceConceptId,
            sourceRelationId: originalRelation.sourceRelationId,
            transactionDate: transactionDate,
            transactionId: transactionId,
        });
    }

    public get hasExtraData(): boolean {
        return this.qualityTypeId.longValue != ID_CONCEPT.longValue;
    }

    public get isAbstraction(): boolean {
        return (
            this.abstractionId.longValue === ID_ABSTRACTION.longValue &&
            this.propertyId.longValue === ID_ABSTRACTION.longValue
        );
    }

    public get isOriginal(): boolean {
        return this.id.longValue === this.sourceRelationId.longValue;
    }

    public setInactive({
        operationConceptId,
        transactionConceptId,
        transactionConceptDate,
    }: {
        operationConceptId: OperationConceptId;
        transactionConceptId: TransactionConceptId;
        transactionConceptDate: TransactionConceptDate;
    }): RawRelation {
        if (!this.isOriginal) {
            throw new CannotDeleteInheritedRelationException({
                relationId: this.id.shortValue,
            });
        }

        const id = RelationId.generateRandom();

        const operationId = new RelationOperationId(
            operationConceptId.longValue,
        );
        const transactionId = new RelationTransactionId(
            transactionConceptId.longValue,
        );
        const transactionDate = new RelationTransactionDate(
            transactionConceptDate.value,
        );

        // TODO: Assert structural relations are not deleted!

        return new RawRelation({
            abstractionId: this.abstractionId,
            conceptId: this.conceptId,
            id: id,
            isActive: new RelationIsActive(false),
            operationId: operationId,
            orderNumber: this.orderNumber,
            propertyId: this.propertyId,
            qualityId: this.qualityId,
            qualityTypeId: this.qualityTypeId,
            sourceConceptId: this.sourceConceptId,
            sourceRelationId: this.sourceRelationId,
            transactionDate: transactionDate,
            transactionId: transactionId,
        });
    }
}

export enum RawRelationField {
    AbstractionId = "RawRelationField.AbstractionId",
    ConceptId = "RawRelationField.ConceptId",
    Id = "RawRelationField.Id",
    IsActive = "RawRelationField.IsActive",
    OperationId = "RawRelationField.OperationId",
    OrderNumber = "RawRelationField.OrderNumber",
    PropertyId = "RawRelationField.Propertyid",
    QualityId = "RawRelationField.QualityId",
    QualityTypeId = "RawRelationField.QualityTypeId",
    SourceConceptId = "RawRelationField.SourceConceptId",
    SourceRelationId = "RawRelationField.SourceRelationId",
    TransactionDate = "RawRelationField.TransactionDate",
    TransactionId = "RawRelationField.TransactionId",
}

export type RawRelationFieldOrder = FieldOrder<RawRelationField>;

export type RawRelationFilter =
    | { field: RawRelationField.AbstractionId; filter: UuidFilter }
    | { field: RawRelationField.ConceptId; filter: UuidFilter }
    | { field: RawRelationField.Id; filter: UuidFilter }
    | { field: RawRelationField.IsActive; filter: BooleanFilter }
    | { field: RawRelationField.OperationId; filter: UuidFilter }
    | { field: RawRelationField.OrderNumber; filter: IntegerNumberFilter }
    | { field: RawRelationField.PropertyId; filter: UuidFilter }
    | { field: RawRelationField.QualityId; filter: UuidFilter }
    | { field: RawRelationField.QualityTypeId; filter: UuidFilter }
    | { field: RawRelationField.SourceConceptId; filter: UuidFilter }
    | { field: RawRelationField.SourceRelationId; filter: UuidFilter }
    | { field: RawRelationField.TransactionDate; filter: DateTimeFilter }
    | { field: RawRelationField.TransactionId; filter: UuidFilter };

export type RawRelationSearchCriteria = SearchCriteria<
    RawRelationFilter,
    RawRelationFieldOrder
>;

export class RelationAbstractionId extends ConceptId {}

export class RelationConceptId extends ConceptId {}

export class RelationId extends UuidValueObject {
    public static generateRandom(): RelationId {
        const randomValue = UuidValueObject.generateRandomValue();
        return new RelationId(randomValue);
    }
}

export class RelationIsActive extends BooleanValueObject {}

export class RelationOperationId extends OperationConceptId {}

export class RelationOrderNumber extends PositiveNonZeroIntegerNumberValueObject {}

export class RelationPropertyId extends ConceptId {}

export class RelationQualityId extends ConceptId {}

export class RelationQualityTypeId extends ConceptId {}

export class RelationSourceConceptId extends RelationConceptId {}

export class RelationSourceRelationId extends RelationId {}

export class RelationTransactionDate extends TransactionConceptDate {}

export class RelationTransactionId extends TransactionConceptId {}
