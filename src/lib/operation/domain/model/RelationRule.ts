import type { BooleanFilter } from "../../../shared/domain/model/Filter";
import type { DateTimeFilter } from "../../../shared/domain/model/Filter";
import type { FieldOrder } from "../../../shared/domain/model/FieldOrder";
import type { NullableIntegerNumberFilter } from "../../../shared/domain/model/Filter";
import type { SearchCriteria } from "../../../shared/domain/model/SearchCriteria";
import type { UuidFilter } from "../../../shared/domain/model/Filter";
import { BooleanValueObject } from "../../../shared/domain/model/ValueObject";
import { ConceptId } from "../../../graph/domain/model/ConceptId";
import { OperationConceptId } from "./OperationConcept";
import { PositiveNonZeroIntegerNumberValueObject } from "../../../shared/domain/model/ValueObject";
import { TransactionConceptDate } from "../../../operation/domain/model/TransactionConceptDate";
import { TransactionConceptId } from "../../../operation/domain/model/TransactionConcept";
import { UuidValueObject } from "../../../shared/domain/model/ValueObject";

export class ActiveRelationRule {
    readonly abstractionId: RelationRuleAbstractionId;
    readonly conceptId: RelationRuleConceptId;
    readonly fixedOrder: RelationRuleFixedOrder;
    readonly id: RelationRuleId;
    readonly maxRelationNumber: RelationRuleMaxRelationNumber | null;
    readonly operationId: RelationRuleOperationId;
    readonly propertyId: RelationRulePropertyId;
    readonly transactionDate: RelationRuleTransactionDate;
    readonly transactionId: RelationRuleTransactionId;
    readonly uniquePerBranch: RelationRuleUniquePerBranch;
    readonly uniquePerConcept: RelationRuleUniquePerConcept;

    constructor(input: {
        abstractionId: RelationRuleAbstractionId;
        conceptId: RelationRuleConceptId;
        fixedOrder: RelationRuleFixedOrder;
        id: RelationRuleId;
        maxRelationNumber: RelationRuleMaxRelationNumber | null;
        operationId: RelationRuleOperationId;
        propertyId: RelationRulePropertyId;
        transactionDate: RelationRuleTransactionDate;
        transactionId: RelationRuleTransactionId;
        uniquePerBranch: RelationRuleUniquePerBranch;
        uniquePerConcept: RelationRuleUniquePerConcept;
    }) {
        this.abstractionId = input.abstractionId;
        this.conceptId = input.conceptId;
        this.fixedOrder = input.fixedOrder;
        this.id = input.id;
        this.maxRelationNumber = input.maxRelationNumber;
        this.operationId = input.operationId;
        this.propertyId = input.propertyId;
        this.transactionDate = input.transactionDate;
        this.transactionId = input.transactionId;
        this.uniquePerBranch = input.uniquePerBranch;
        this.uniquePerConcept = input.uniquePerConcept;
    }

    public static fromRaw(
        rawRelationRule: RawRelationRule,
    ): ActiveRelationRule {
        return new ActiveRelationRule({
            abstractionId: rawRelationRule.abstractionId,
            conceptId: rawRelationRule.conceptId,
            fixedOrder: rawRelationRule.fixedOrder,
            id: rawRelationRule.id,
            maxRelationNumber: rawRelationRule.maxRelationNumber,
            operationId: rawRelationRule.operationId,
            propertyId: rawRelationRule.propertyId,
            transactionDate: rawRelationRule.transactionDate,
            transactionId: rawRelationRule.transactionId,
            uniquePerBranch: rawRelationRule.uniquePerBranch,
            uniquePerConcept: rawRelationRule.uniquePerConcept,
        });
    }

    public toRaw(): RawRelationRule {
        return new RawRelationRule({
            abstractionId: this.abstractionId,
            conceptId: this.conceptId,
            fixedOrder: this.fixedOrder,
            id: this.id,
            isActive: new RelationRuleIsActive(true),
            maxRelationNumber: this.maxRelationNumber,
            operationId: this.operationId,
            propertyId: this.propertyId,
            transactionDate: this.transactionDate,
            transactionId: this.transactionId,
            uniquePerBranch: this.uniquePerBranch,
            uniquePerConcept: this.uniquePerConcept,
        });
    }

    public update(input: {
        operationConceptId: OperationConceptId;
        transactionConceptId: TransactionConceptId;
        transactionConceptDate: TransactionConceptDate;
        fixedOrder: RelationRuleFixedOrder;
        uniquePerBranch: RelationRuleUniquePerBranch;
        uniquePerConcept: RelationRuleUniquePerConcept;
        maxRelationNumber: RelationRuleMaxRelationNumber;
    }): RawRelationRule {
        const id = RelationRuleId.generateRandom();

        const operationId = new RelationRuleOperationId(
            input.operationConceptId.longValue,
        );
        const transactionId = new RelationRuleTransactionId(
            input.transactionConceptId.longValue,
        );
        const transactionDate = new RelationRuleTransactionDate(
            input.transactionConceptDate.value,
        );

        return new RawRelationRule({
            abstractionId: this.abstractionId,
            conceptId: this.conceptId,
            fixedOrder: input.fixedOrder,
            id: id,
            isActive: new RelationRuleIsActive(true),
            maxRelationNumber: input.maxRelationNumber,
            operationId: operationId,
            propertyId: this.propertyId,
            transactionDate: transactionDate,
            transactionId: transactionId,
            uniquePerBranch: input.uniquePerBranch,
            uniquePerConcept: input.uniquePerConcept,
        });
    }
}

export enum ActiveRelationRuleField {
    AbstractionId = "ActiveRelationRuleField.AbstractionId",
    ConceptId = "ActiveRelationRuleField.ConceptId",
    FixedOrder = "ActiveRelationRuleField.FixedOrder",
    Id = "ActiveRelationRuleField.Id",
    MaxRelationNumber = "ActiveRelationRuleField.MaxRelationNumber",
    OperationId = "ActiveRelationRuleField.OperationId",
    PropertyId = "ActiveRelationRuleField.PropertyId",
    TransactionDate = "ActiveRelationRuleField.TransactionDate",
    TransactionId = "ActiveRelationRuleField.TransactionId",
    UniquePerBranch = "ActiveRelationRuleField.UniquePerBranch",
    UniquePerConcept = "ActiveRelationRuleField.UniquePerConcept",
}

export type ActiveRelationRuleFieldOrder = FieldOrder<ActiveRelationRuleField>;

export type ActiveRelationRuleFilter =
    | { field: ActiveRelationRuleField.AbstractionId; filter: UuidFilter }
    | { field: ActiveRelationRuleField.ConceptId; filter: UuidFilter }
    | { field: ActiveRelationRuleField.FixedOrder; filter: BooleanFilter }
    | { field: ActiveRelationRuleField.Id; filter: UuidFilter }
    | {
          field: ActiveRelationRuleField.MaxRelationNumber;
          filter: NullableIntegerNumberFilter;
      }
    | { field: ActiveRelationRuleField.OperationId; filter: UuidFilter }
    | { field: ActiveRelationRuleField.PropertyId; filter: UuidFilter }
    | { field: ActiveRelationRuleField.TransactionDate; filter: DateTimeFilter }
    | { field: ActiveRelationRuleField.TransactionId; filter: UuidFilter }
    | { field: ActiveRelationRuleField.UniquePerBranch; filter: BooleanFilter }
    | {
          field: ActiveRelationRuleField.UniquePerConcept;
          filter: BooleanFilter;
      };

export type ActiveRelationRuleSearchCriteria = SearchCriteria<
    ActiveRelationRuleFilter,
    ActiveRelationRuleFieldOrder
>;

export class RawRelationRule {
    readonly abstractionId: RelationRuleAbstractionId;
    readonly conceptId: RelationRuleConceptId;
    readonly fixedOrder: RelationRuleFixedOrder;
    readonly id: RelationRuleId;
    readonly isActive: RelationRuleIsActive;
    readonly maxRelationNumber: RelationRuleMaxRelationNumber | null;
    readonly operationId: RelationRuleOperationId;
    readonly propertyId: RelationRulePropertyId;
    readonly transactionDate: RelationRuleTransactionDate;
    readonly transactionId: RelationRuleTransactionId;
    readonly uniquePerBranch: RelationRuleUniquePerBranch;
    readonly uniquePerConcept: RelationRuleUniquePerConcept;

    constructor(input: {
        abstractionId: RelationRuleAbstractionId;
        conceptId: RelationRuleConceptId;
        fixedOrder: RelationRuleFixedOrder;
        id: RelationRuleId;
        isActive: RelationRuleIsActive;
        maxRelationNumber: RelationRuleMaxRelationNumber | null;
        operationId: RelationRuleOperationId;
        propertyId: RelationRulePropertyId;
        transactionDate: RelationRuleTransactionDate;
        transactionId: RelationRuleTransactionId;
        uniquePerBranch: RelationRuleUniquePerBranch;
        uniquePerConcept: RelationRuleUniquePerConcept;
    }) {
        this.abstractionId = input.abstractionId;
        this.conceptId = input.conceptId;
        this.fixedOrder = input.fixedOrder;
        this.id = input.id;
        this.isActive = input.isActive;
        this.maxRelationNumber = input.maxRelationNumber;
        this.operationId = input.operationId;
        this.propertyId = input.propertyId;
        this.transactionDate = input.transactionDate;
        this.transactionId = input.transactionId;
        this.uniquePerBranch = input.uniquePerBranch;
        this.uniquePerConcept = input.uniquePerConcept;
    }

    public static create(input: {
        operationConceptId: OperationConceptId;
        transactionConceptId: TransactionConceptId;
        transactionConceptDate: TransactionConceptDate;
        conceptConceptId: ConceptId;
        conceptAbstractionId: ConceptId;
        conceptPropertyId: ConceptId;
        maxRelationNumber: RelationRuleMaxRelationNumber;
        fixedOrder: RelationRuleFixedOrder;
        uniquePerBranch: RelationRuleUniquePerBranch;
        uniquePerConcept: RelationRuleUniquePerConcept;
    }): RawRelationRule {
        const id = RelationRuleId.generateRandom();

        const conceptId = new RelationRuleConceptId(
            input.conceptConceptId.longValue,
        );

        const abstractionId = new RelationRuleAbstractionId(
            input.conceptAbstractionId.longValue,
        );
        const propertyId = new RelationRulePropertyId(
            input.conceptPropertyId.longValue,
        );

        const operationId = new RelationRuleOperationId(
            input.operationConceptId.longValue,
        );
        const transactionId = new RelationRuleTransactionId(
            input.transactionConceptId.longValue,
        );
        const transactionDate = new RelationRuleTransactionDate(
            input.transactionConceptDate.value,
        );

        return new RawRelationRule({
            abstractionId: abstractionId,
            conceptId: conceptId,
            fixedOrder: input.fixedOrder,
            id: id,
            isActive: new RelationRuleIsActive(true),
            maxRelationNumber: input.maxRelationNumber,
            operationId: operationId,
            propertyId: propertyId,
            transactionDate: transactionDate,
            transactionId: transactionId,
            uniquePerBranch: input.uniquePerBranch,
            uniquePerConcept: input.uniquePerConcept,
        });
    }

    public setInactive(input: {
        operationConceptId: OperationConceptId;
        transactionConceptId: TransactionConceptId;
        transactionConceptDate: TransactionConceptDate;
    }): RawRelationRule {
        const id = RelationRuleId.generateRandom();
        const operationId = new RelationRuleOperationId(
            input.operationConceptId.longValue,
        );
        const transactionId = new RelationRuleTransactionId(
            input.transactionConceptId.longValue,
        );
        const transactionDate = new RelationRuleTransactionDate(
            input.transactionConceptDate.value,
        );

        // TODO: Assert structural rules are not deleted!

        return new RawRelationRule({
            abstractionId: this.abstractionId,
            conceptId: this.conceptId,
            fixedOrder: this.fixedOrder,
            id: id,
            isActive: new RelationRuleIsActive(false),
            maxRelationNumber: this.maxRelationNumber,
            operationId: operationId,
            propertyId: this.propertyId,
            transactionDate: transactionDate,
            transactionId: transactionId,
            uniquePerBranch: this.uniquePerBranch,
            uniquePerConcept: this.uniquePerConcept,
        });
    }
}

export enum RawRelationRuleField {
    AbstractionId = "RawRelationRuleField.AbstractionId",
    ConceptId = "RawRelationRuleField.ConceptId",
    FixedOrder = "RawRelationRuleField.FixedOrder",
    Id = "RawRelationRuleField.Id",
    IsActive = "RawRelationRuleField.IsActive",
    MaxRelationNumber = "RawRelationRuleField.MaxRelationNumber",
    OperationId = "RawRelationRuleField.OperationId",
    PropertyId = "RawRelationRuleField.PropertyId",
    TransactionDate = "RawRelationRuleField.TransactionDate",
    TransactionId = "RawRelationRuleField.TransactionId",
    UniquePerBranch = "RawRelationRuleField.UniquePerBranch",
    UniquePerConcept = "RawRelationRuleField.UniquePerConcept",
}

export type RawRelationRuleFieldOrder = FieldOrder<RawRelationRuleField>;

export type RawRelationRuleFilter =
    | { field: RawRelationRuleField.AbstractionId; filter: UuidFilter }
    | { field: RawRelationRuleField.ConceptId; filter: UuidFilter }
    | { field: RawRelationRuleField.FixedOrder; filter: BooleanFilter }
    | { field: RawRelationRuleField.Id; filter: UuidFilter }
    | { field: RawRelationRuleField.IsActive; filter: BooleanFilter }
    | {
          field: RawRelationRuleField.MaxRelationNumber;
          filter: NullableIntegerNumberFilter;
      }
    | { field: RawRelationRuleField.OperationId; filter: UuidFilter }
    | { field: RawRelationRuleField.PropertyId; filter: UuidFilter }
    | { field: RawRelationRuleField.TransactionDate; filter: DateTimeFilter }
    | { field: RawRelationRuleField.TransactionId; filter: UuidFilter }
    | { field: RawRelationRuleField.UniquePerBranch; filter: BooleanFilter }
    | {
          field: RawRelationRuleField.UniquePerConcept;
          filter: BooleanFilter;
      };

export type RawRelationRuleSearchCriteria = SearchCriteria<
    RawRelationRuleFilter,
    RawRelationRuleFieldOrder
>;

export class RelationRuleAbstractionId extends ConceptId {}

export class RelationRuleConceptId extends ConceptId {}

export class RelationRuleFixedOrder extends BooleanValueObject {}

export class RelationRuleId extends UuidValueObject {
    public static generateRandom(): RelationRuleId {
        const randomValue = UuidValueObject.generateRandomValue();
        return new RelationRuleId(randomValue);
    }
}

export class RelationRuleIsActive extends BooleanValueObject {}

export class RelationRuleMaxRelationNumber extends PositiveNonZeroIntegerNumberValueObject {}

export class RelationRuleOperationId extends OperationConceptId {}

export class RelationRulePropertyId extends ConceptId {}

export class RelationRuleTransactionDate extends TransactionConceptDate {}

export class RelationRuleTransactionId extends TransactionConceptId {}

export class RelationRuleUniquePerBranch extends BooleanValueObject {}

export class RelationRuleUniquePerConcept extends BooleanValueObject {}
