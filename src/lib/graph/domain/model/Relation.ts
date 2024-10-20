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
    readonly originConceptId: RelationOriginConceptId;
    readonly originRelationId: RelationOriginRelationId;
    readonly propertyId: RelationPropertyId;
    readonly qualityId: RelationQualityId;
    readonly qualityTypeId: RelationQualityTypeId;
    readonly transactionDate: RelationTransactionDate;
    readonly transactionId: RelationTransactionId;

    constructor(input: {
        abstractionId: RelationAbstractionId;
        conceptId: RelationConceptId;
        id: RelationId;
        operationId: RelationOperationId;
        orderNumber: RelationOrderNumber;
        originConceptId: RelationOriginConceptId;
        originRelationId: RelationOriginRelationId;
        propertyId: RelationPropertyId;
        qualityId: RelationQualityId;
        qualityTypeId: RelationQualityTypeId;
        transactionDate: RelationTransactionDate;
        transactionId: RelationTransactionId;
    }) {
        this.abstractionId = input.abstractionId;
        this.conceptId = input.conceptId;
        this.id = input.id;
        this.operationId = input.operationId;
        this.orderNumber = input.orderNumber;
        this.originConceptId = input.originConceptId;
        this.originRelationId = input.originRelationId;
        this.propertyId = input.propertyId;
        this.qualityId = input.qualityId;
        this.qualityTypeId = input.qualityTypeId;
        this.transactionDate = input.transactionDate;
        this.transactionId = input.transactionId;
    }

    public static fromRaw(rawRelation: RawRelation): ActiveRelation {
        return new ActiveRelation({
            abstractionId: rawRelation.abstractionId,
            conceptId: rawRelation.conceptId,
            id: rawRelation.id,
            operationId: rawRelation.operationId,
            orderNumber: rawRelation.orderNumber,
            originConceptId: rawRelation.originConceptId,
            originRelationId: rawRelation.originRelationId,
            propertyId: rawRelation.propertyId,
            qualityId: rawRelation.qualityId,
            qualityTypeId: rawRelation.qualityTypeId,
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
            originConceptId: this.originConceptId,
            originRelationId: this.originRelationId,
            propertyId: this.propertyId,
            qualityId: this.qualityId,
            qualityTypeId: this.qualityTypeId,
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
        return this.id.longValue === this.originRelationId.longValue;
    }

    public updateOrder(input: {
        operationConceptId: OperationConceptId;
        transactionConceptId: TransactionConceptId;
        transactionConceptDate: TransactionConceptDate;
        orderNumber: RelationOrderNumber;
    }): RawRelation {
        const id = RelationId.generateRandom();

        const operationId = new RelationOperationId(
            input.operationConceptId.longValue,
        );
        const transactionId = new RelationTransactionId(
            input.transactionConceptId.longValue,
        );
        const transactionDate = new RelationTransactionDate(
            input.transactionConceptDate.value,
        );

        return new RawRelation({
            abstractionId: this.abstractionId,
            conceptId: this.conceptId,
            id: id,
            isActive: new RelationIsActive(true),
            operationId: operationId,
            orderNumber: input.orderNumber,
            originConceptId: this.originConceptId,
            originRelationId: this.originRelationId,
            propertyId: this.propertyId,
            qualityId: this.qualityId,
            qualityTypeId: this.qualityTypeId,
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
    OriginConceptId = "ActiveRelationField.OriginConceptId",
    OriginRelationId = "ActiveRelationField.OriginRelationId",
    PropertyId = "ActiveRelationField.Propertyid",
    QualityId = "ActiveRelationField.QualityId",
    QualityTypeId = "ActiveRelationField.QualityTypeId",
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
    | { field: ActiveRelationField.OriginConceptId; filter: UuidFilter }
    | { field: ActiveRelationField.OriginRelationId; filter: UuidFilter }
    | { field: ActiveRelationField.PropertyId; filter: UuidFilter }
    | { field: ActiveRelationField.QualityId; filter: UuidFilter }
    | { field: ActiveRelationField.QualityTypeId; filter: UuidFilter }
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
    readonly originConceptId: RelationOriginConceptId;
    readonly originRelationId: RelationOriginRelationId;
    readonly propertyId: RelationPropertyId;
    readonly qualityId: RelationQualityId;
    readonly qualityTypeId: RelationQualityTypeId;
    readonly transactionDate: RelationTransactionDate;
    readonly transactionId: RelationTransactionId;

    constructor(input: {
        abstractionId: RelationAbstractionId;
        conceptId: RelationConceptId;
        id: RelationId;
        isActive: RelationIsActive;
        operationId: RelationOperationId;
        orderNumber: RelationOrderNumber;
        originConceptId: RelationOriginConceptId;
        originRelationId: RelationOriginRelationId;
        propertyId: RelationPropertyId;
        qualityId: RelationQualityId;
        qualityTypeId: RelationQualityTypeId;
        transactionDate: RelationTransactionDate;
        transactionId: RelationTransactionId;
    }) {
        this.abstractionId = input.abstractionId;
        this.conceptId = input.conceptId;
        this.id = input.id;
        this.isActive = input.isActive;
        this.operationId = input.operationId;
        this.orderNumber = input.orderNumber;
        this.originConceptId = input.originConceptId;
        this.originRelationId = input.originRelationId;
        this.propertyId = input.propertyId;
        this.qualityId = input.qualityId;
        this.qualityTypeId = input.qualityTypeId;
        this.transactionDate = input.transactionDate;
        this.transactionId = input.transactionId;
    }

    public static create(input: {
        operationConceptId: OperationConceptId;
        transactionConceptId: TransactionConceptId;
        transactionConceptDate: TransactionConceptDate;
        conceptId: ConceptId;
        abstractionId: ConceptId;
        propertyId: ConceptId;
        orderNumber: RelationOrderNumber | null;
        qualityId: ConceptId;
        qualityTypeId: ConceptId;
    }): RawRelation {
        const id = RelationId.generateRandom();

        const conceptId = new RelationConceptId(input.conceptId.longValue);

        const abstractionId = new RelationAbstractionId(
            input.abstractionId.longValue,
        );
        const propertyId = new RelationPropertyId(input.propertyId.longValue);
        const qualityId = new RelationQualityId(input.qualityId.longValue);
        const qualityTypeId = new RelationQualityTypeId(
            input.qualityTypeId.longValue,
        );

        const originConceptId = new RelationOriginConceptId(
            conceptId.longValue,
        );
        const originRelationId = new RelationOriginRelationId(id.longValue);

        const operationId = new RelationOperationId(
            input.operationConceptId.longValue,
        );
        const transactionId = new RelationTransactionId(
            input.transactionConceptId.longValue,
        );
        const transactionDate = new RelationTransactionDate(
            input.transactionConceptDate.value,
        );

        return new RawRelation({
            abstractionId: abstractionId,
            conceptId: conceptId,
            id: id,
            isActive: new RelationIsActive(true),
            operationId: operationId,
            orderNumber:
                input.orderNumber ?? new RelationOrderNumber(BigInt(1)),
            originConceptId: originConceptId,
            originRelationId: originRelationId,
            propertyId: propertyId,
            qualityId: qualityId,
            qualityTypeId: qualityTypeId,
            transactionDate: transactionDate,
            transactionId: transactionId,
        });
    }

    public static createInherited(input: {
        operationConceptId: OperationConceptId;
        transactionConceptId: TransactionConceptId;
        transactionConceptDate: TransactionConceptDate;
        inheritorConceptId: ConceptId;
        originalRelation: RawRelation;
    }): RawRelation {
        const id = RelationId.generateRandom();

        const conceptId = new RelationConceptId(
            input.inheritorConceptId.longValue,
        );

        const operationId = new RelationOperationId(
            input.operationConceptId.longValue,
        );
        const transactionId = new RelationTransactionId(
            input.transactionConceptId.longValue,
        );
        const transactionDate = new RelationTransactionDate(
            input.transactionConceptDate.value,
        );

        return new RawRelation({
            abstractionId: input.originalRelation.abstractionId,
            conceptId: conceptId,
            id: id,
            isActive: input.originalRelation.isActive,
            operationId: operationId,
            orderNumber: input.originalRelation.orderNumber,
            originConceptId: input.originalRelation.originConceptId,
            originRelationId: input.originalRelation.originRelationId,
            propertyId: input.originalRelation.propertyId,
            qualityId: input.originalRelation.qualityId,
            qualityTypeId: input.originalRelation.qualityTypeId,
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
        return this.id.longValue === this.originRelationId.longValue;
    }

    public setInactive(input: {
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
            input.operationConceptId.longValue,
        );
        const transactionId = new RelationTransactionId(
            input.transactionConceptId.longValue,
        );
        const transactionDate = new RelationTransactionDate(
            input.transactionConceptDate.value,
        );

        // TODO: Assert structural relations are not deleted!

        return new RawRelation({
            abstractionId: this.abstractionId,
            conceptId: this.conceptId,
            id: id,
            isActive: new RelationIsActive(false),
            operationId: operationId,
            orderNumber: this.orderNumber,
            originConceptId: this.originConceptId,
            originRelationId: this.originRelationId,
            propertyId: this.propertyId,
            qualityId: this.qualityId,
            qualityTypeId: this.qualityTypeId,
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
    OriginConceptId = "RawRelationField.OriginConceptId",
    OriginRelationId = "RawRelationField.OriginRelationId",
    PropertyId = "RawRelationField.Propertyid",
    QualityId = "RawRelationField.QualityId",
    QualityTypeId = "RawRelationField.QualityTypeId",
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
    | { field: RawRelationField.OriginConceptId; filter: UuidFilter }
    | { field: RawRelationField.OriginRelationId; filter: UuidFilter }
    | { field: RawRelationField.PropertyId; filter: UuidFilter }
    | { field: RawRelationField.QualityId; filter: UuidFilter }
    | { field: RawRelationField.QualityTypeId; filter: UuidFilter }
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

export class RelationOriginConceptId extends RelationConceptId {}

export class RelationOriginRelationId extends RelationId {}

export class RelationPropertyId extends ConceptId {}

export class RelationQualityId extends ConceptId {}

export class RelationQualityTypeId extends ConceptId {}

export class RelationTransactionDate extends TransactionConceptDate {}

export class RelationTransactionId extends TransactionConceptId {}
