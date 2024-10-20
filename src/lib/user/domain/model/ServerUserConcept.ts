import type { BooleanFilter } from "../../../shared/domain/model/Filter";
import type { ConceptId } from "../../../graph/domain/model/ConceptId";
import type { DateTimeFilter } from "../../../shared/domain/model/Filter";
import type { FieldOrder } from "../../../shared/domain/model/FieldOrder";
import type { SearchCriteria } from "../../../shared/domain/model/SearchCriteria";
import type { TextFilter } from "../../../shared/domain/model/Filter";
import type { UuidFilter } from "../../../shared/domain/model/Filter";
import { PrivateUserConcept } from "./UserConcept";
import { PublicUserConcept } from "./UserConcept";
import { TextValueObject } from "../../../shared/domain/model/ValueObject";
import { TransactionConceptDate } from "../../../operation/domain/model/TransactionConceptDate";
import { UserConceptEmail } from "./UserConcept";
import { UserConceptId } from "./UserConcept";
import { UserConceptIsAdmin } from "./UserConcept";
import { UserConceptPlaintextPassword } from "./UserConcept";
import { UserConceptRestrictedAccess } from "./UserConcept";
import { UserConceptSuspendedAccount } from "./UserConcept";
import { UserConceptTransactionDate } from "./UserConcept";

export class ServerUserConcept {
    email: UserConceptEmail;
    encryptedPassword: ServerUserConceptEncryptedPassword;
    readonly id: UserConceptId;
    isAdmin: UserConceptIsAdmin;
    restrictedAccess: UserConceptRestrictedAccess;
    suspendedAccount: UserConceptSuspendedAccount;
    readonly transactionDate: UserConceptTransactionDate;

    constructor(input: {
        email: UserConceptEmail;
        encryptedPassword: ServerUserConceptEncryptedPassword;
        id: UserConceptId;
        isAdmin: UserConceptIsAdmin;
        restrictedAccess: UserConceptRestrictedAccess;
        suspendedAccount: UserConceptSuspendedAccount;
        transactionDate: UserConceptTransactionDate;
    }) {
        this.email = input.email;
        this.encryptedPassword = input.encryptedPassword;
        this.id = input.id;
        this.isAdmin = input.isAdmin;
        this.restrictedAccess = input.restrictedAccess;
        this.suspendedAccount = input.suspendedAccount;
        this.transactionDate = input.transactionDate;
    }

    public static create(input: {
        conceptId: ConceptId;
        email: UserConceptEmail;
        encryptedPassword: ServerUserConceptEncryptedPassword;
        isAdmin: UserConceptIsAdmin;
        restrictedAccess: UserConceptRestrictedAccess;
        suspendedAccount: UserConceptSuspendedAccount;
        transactionConceptDate: TransactionConceptDate;
    }): ServerUserConcept {
        const id = new UserConceptId(input.conceptId.shortValue);
        const transactionDate = new UserConceptTransactionDate(
            input.transactionConceptDate.value,
        );

        return new ServerUserConcept({
            email: input.email,
            encryptedPassword: input.encryptedPassword,
            id: id,
            isAdmin: input.isAdmin,
            restrictedAccess: input.restrictedAccess,
            suspendedAccount: input.suspendedAccount,
            transactionDate: transactionDate,
        });
    }

    public toPrivate(): PrivateUserConcept {
        return new PrivateUserConcept({
            email: this.email,
            id: this.id,
            isAdmin: this.isAdmin,
            restrictedAccess: this.restrictedAccess,
            suspendedAccount: this.suspendedAccount,
            transactionDate: this.transactionDate,
        });
    }

    public toPublic(): PublicUserConcept {
        return new PublicUserConcept({
            id: this.id,
            isAdmin: this.isAdmin,
            restrictedAccess: this.restrictedAccess,
            suspendedAccount: this.suspendedAccount,
            transactionDate: this.transactionDate,
        });
    }

    public update(input: {
        email: UserConceptEmail;
        isAdmin: UserConceptIsAdmin;
        restrictedAccess: UserConceptRestrictedAccess;
        suspendedAccount: UserConceptSuspendedAccount;
    }) {
        this.email = input.email;
        this.isAdmin = input.isAdmin;
        this.restrictedAccess = input.restrictedAccess;
        this.suspendedAccount = input.suspendedAccount;
    }

    public updatePassword(
        newEncryptedPassword: ServerUserConceptEncryptedPassword,
    ) {
        this.encryptedPassword = newEncryptedPassword;
    }
}

export class ServerUserConceptEncryptedPassword extends TextValueObject {
    public passwordIsCorrect(
        plaintextPassword: UserConceptPlaintextPassword,
    ): boolean {
        // TODO: Check properly!!!
        return this.value === plaintextPassword.value;
    }

    public static fromPlaintextPassword(
        plaintextPassword: UserConceptPlaintextPassword,
    ): ServerUserConceptEncryptedPassword {
        const value = plaintextPassword.value;
        // TODO: Encrypt!!!
        return new ServerUserConceptEncryptedPassword(value);
    }
}

export enum ServerUserConceptField {
    Email = "ServerUserConceptField.Email",
    Id = "ServerUserConceptField.Id",
    IsAdmin = "ServerUserConceptField.IsAdmin",
    RestrictedAccess = "ServerUserConceptField.RestrictedAccess",
    SuspendedAccount = "ServerUserConceptField.SuspendedAccount",
    TransactionDate = "ServerUserConceptField.TransactionDate",
}

export type ServerUserConceptFieldOrder = FieldOrder<ServerUserConceptField>;

export type ServerUserConceptFilter =
    | { field: ServerUserConceptField.Email; filter: TextFilter }
    | { field: ServerUserConceptField.Id; filter: UuidFilter }
    | { field: ServerUserConceptField.IsAdmin; filter: BooleanFilter }
    | { field: ServerUserConceptField.RestrictedAccess; filter: BooleanFilter }
    | { field: ServerUserConceptField.SuspendedAccount; filter: BooleanFilter }
    | {
          field: ServerUserConceptField.TransactionDate;
          filter: DateTimeFilter;
      };

export type ServerUserConceptSearchCriteria = SearchCriteria<
    ServerUserConceptFilter,
    ServerUserConceptFieldOrder
>;
