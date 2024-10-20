import type { DateTimeFilter } from "../../../shared/domain/model/Filter";
import type { FieldOrder } from "../../../shared/domain/model/FieldOrder";
import type { NullableDateTimeFilter } from "../../../shared/domain/model/Filter";
import type { SearchCriteria } from "../../../shared/domain/model/SearchCriteria";
import type { UuidFilter } from "../../../shared/domain/model/Filter";
import { ConceptId } from "../../../graph/domain/model/ConceptId";
import { TransactionConceptDate } from "./TransactionConceptDate";
import { UserConceptId } from "../../../user/domain/model/UserConcept";
import { UuidValueObject } from "../../../shared/domain/model/ValueObject";

export class OperationConcept {
    endDate: OperationConceptEndDate | null;
    readonly id: OperationConceptId;
    readonly startDate: OperationConceptStartDate;
    readonly userId: OperationConceptUserId;

    constructor(input: {
        endDate: OperationConceptEndDate | null;
        id: OperationConceptId;
        startDate: OperationConceptStartDate;
        userId: OperationConceptUserId;
    }) {
        this.endDate = input.endDate;
        this.id = input.id;
        this.startDate = input.startDate;
        this.userId = input.userId;
    }

    public static create(input: {
        conceptId: ConceptId;
        transactionConceptDate: TransactionConceptDate;
        userConceptId: UserConceptId;
    }): OperationConcept {
        const id = new OperationConceptId(input.conceptId.longValue);
        const startDate = new OperationConceptStartDate(
            input.transactionConceptDate.value,
        );
        const endDate = null;
        const userId = new OperationConceptUserId(
            input.userConceptId.longValue,
        );

        return new OperationConcept({
            endDate,
            id,
            startDate,
            userId,
        });
    }
}

export class OperationConceptEndDate extends TransactionConceptDate {}

export enum OperationConceptField {
    EndDate = "OperationConceptField.EndDate",
    Id = "OperationConceptField.Id",
    StartDate = "OperationConceptField.StartDate",
    UserId = "OperationConceptField.UserId",
}

export type OperationConceptFieldOrder = FieldOrder<OperationConceptField>;

export type OperationConceptFilter =
    | { field: OperationConceptField.EndDate; filter: NullableDateTimeFilter }
    | { field: OperationConceptField.Id; filter: UuidFilter }
    | { field: OperationConceptField.StartDate; filter: DateTimeFilter }
    | { field: OperationConceptField.UserId; filter: UuidFilter };

export class OperationConceptId extends ConceptId {
    public static generateRandom(): OperationConceptId {
        const randomValue = UuidValueObject.generateRandomValue();
        return new OperationConceptId(randomValue);
    }
}

export type OperationConceptSearchCriteria = SearchCriteria<
    OperationConceptFilter,
    OperationConceptFieldOrder
>;

export class OperationConceptStartDate extends TransactionConceptDate {}

export class OperationConceptUserId extends UserConceptId {}
