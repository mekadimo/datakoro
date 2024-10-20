import type { BooleanFilter } from "../../../shared/domain/model/Filter";
import type { DateTimeFilter } from "../../../shared/domain/model/Filter";
import type { FieldOrder } from "../../../shared/domain/model/FieldOrder";
import type { SearchCriteria } from "../../../shared/domain/model/SearchCriteria";
import type { TextFilter } from "../../../shared/domain/model/Filter";
import type { UuidFilter } from "../../../shared/domain/model/Filter";
import { BooleanValueObject } from "../../../shared/domain/model/ValueObject";
import { ConceptId } from "../../../graph/domain/model/ConceptId";
import { TextValueObject } from "../../../shared/domain/model/ValueObject";
import { TransactionConceptDate } from "../../../operation/domain/model/TransactionConceptDate";

export const USER_EMAIL_MAX_LENGTH = 320;
export const USER_PASSWORD_MAX_LENGTH = 50;

export class PrivateUserConcept {
    email: UserConceptEmail;
    readonly id: UserConceptId;
    isAdmin: UserConceptIsAdmin;
    restrictedAccess: UserConceptRestrictedAccess;
    suspendedAccount: UserConceptSuspendedAccount;
    readonly transactionDate: UserConceptTransactionDate;

    constructor(input: {
        email: UserConceptEmail;
        id: UserConceptId;
        isAdmin: UserConceptIsAdmin;
        restrictedAccess: UserConceptRestrictedAccess;
        suspendedAccount: UserConceptSuspendedAccount;
        transactionDate: UserConceptTransactionDate;
    }) {
        this.email = input.email;
        this.id = input.id;
        this.isAdmin = input.isAdmin;
        this.restrictedAccess = input.restrictedAccess;
        this.suspendedAccount = input.suspendedAccount;
        this.transactionDate = input.transactionDate;
    }
}

export enum PrivateUserConceptField {
    Email = "PrivateUserConceptField.Email",
    Id = "PrivateUserConceptField.Id",
    IsAdmin = "PrivateUserConceptField.IsAdmin",
    RestrictedAccess = "PrivateUserConceptField.RestrictedAccess",
    SuspendedAccount = "PrivateUserConceptField.SuspendedAccount",
    TransactionDate = "PrivateUserConceptField.TransactionDate",
}

export type PrivateUserConceptFieldOrder = FieldOrder<PrivateUserConceptField>;

export type PrivateUserConceptFilter =
    | { field: PrivateUserConceptField.Email; filter: TextFilter }
    | { field: PrivateUserConceptField.Id; filter: UuidFilter }
    | { field: PrivateUserConceptField.IsAdmin; filter: BooleanFilter }
    | { field: PrivateUserConceptField.RestrictedAccess; filter: BooleanFilter }
    | { field: PrivateUserConceptField.SuspendedAccount; filter: BooleanFilter }
    | {
          field: PrivateUserConceptField.TransactionDate;
          filter: DateTimeFilter;
      };

export type PrivateUserConceptSearchCriteria = SearchCriteria<
    PrivateUserConceptFilter,
    PrivateUserConceptFieldOrder
>;

export class PublicUserConcept {
    id: UserConceptId;
    isAdmin: UserConceptIsAdmin;
    restrictedAccess: UserConceptRestrictedAccess;
    suspendedAccount: UserConceptSuspendedAccount;
    transactionDate: UserConceptTransactionDate;

    constructor(input: {
        id: UserConceptId;
        isAdmin: UserConceptIsAdmin;
        restrictedAccess: UserConceptRestrictedAccess;
        suspendedAccount: UserConceptSuspendedAccount;
        transactionDate: UserConceptTransactionDate;
    }) {
        this.id = input.id;
        this.isAdmin = input.isAdmin;
        this.restrictedAccess = input.restrictedAccess;
        this.suspendedAccount = input.suspendedAccount;
        this.transactionDate = input.transactionDate;
    }
}

export enum PublicUserConceptField {
    Id = "PublicUserConceptField.Id",
    IsAdmin = "PublicUserConceptField.IsAdmin",
    RestrictedAccess = "PublicUserConceptField.RestrictedAccess",
    SuspendedAccount = "PublicUserConceptField.SuspendedAccount",
    TransactionDate = "PublicUserConceptField.TransactionDate",
}

export type PublicUserConceptFieldOrder = FieldOrder<PublicUserConceptField>;

export type PublicUserConceptFilter =
    | { field: PublicUserConceptField.Id; filter: UuidFilter }
    | { field: PublicUserConceptField.IsAdmin; filter: BooleanFilter }
    | { field: PublicUserConceptField.RestrictedAccess; filter: BooleanFilter }
    | { field: PublicUserConceptField.SuspendedAccount; filter: BooleanFilter }
    | {
          field: PublicUserConceptField.TransactionDate;
          filter: DateTimeFilter;
      };

export type PublicUserConceptSearchCriteria = SearchCriteria<
    PublicUserConceptFilter,
    PublicUserConceptFieldOrder
>;

export class UserConceptEmail extends TextValueObject {
    constructor(inputValue: string) {
        UserConceptEmail.assertIsValid(inputValue);
        super(inputValue);
    }

    private static assertIsValid(inputValue: string): void {
        if (0 === inputValue.length) {
            // TODO
        }
        if (inputValue.length > USER_EMAIL_MAX_LENGTH) {
            // TODO
        }
        // TODO: Check email is valid
    }
}

export class UserConceptId extends ConceptId {}

export class UserConceptIsAdmin extends BooleanValueObject {}

export class UserConceptPlaintextPassword extends TextValueObject {
    constructor(inputValue: string) {
        UserConceptPlaintextPassword.assertIsValid(inputValue);
        super(inputValue);
    }

    private static assertIsValid(inputValue: string): void {
        if (inputValue.length > USER_PASSWORD_MAX_LENGTH) {
            // TODO
        }
        // TODO: Min length, allowed characters, etc.
    }
}

export class UserConceptRestrictedAccess extends BooleanValueObject {}

export class UserConceptSuspendedAccount extends BooleanValueObject {}

export class UserConceptTransactionDate extends TransactionConceptDate {}
