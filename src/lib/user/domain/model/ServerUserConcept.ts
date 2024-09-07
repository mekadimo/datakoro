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

    constructor({
        email,
        encryptedPassword,
        id,
        isAdmin,
        restrictedAccess,
        suspendedAccount,
        transactionDate,
    }: {
        email: UserConceptEmail;
        encryptedPassword: ServerUserConceptEncryptedPassword;
        id: UserConceptId;
        isAdmin: UserConceptIsAdmin;
        restrictedAccess: UserConceptRestrictedAccess;
        suspendedAccount: UserConceptSuspendedAccount;
        transactionDate: UserConceptTransactionDate;
    }) {
        this.email = email;
        this.encryptedPassword = encryptedPassword;
        this.id = id;
        this.isAdmin = isAdmin;
        this.restrictedAccess = restrictedAccess;
        this.suspendedAccount = suspendedAccount;
        this.transactionDate = transactionDate;
    }

    public static create({
        conceptId,
        email,
        encryptedPassword,
        isAdmin,
        restrictedAccess,
        suspendedAccount,
        transactionConceptDate,
    }: {
        conceptId: ConceptId;
        email: UserConceptEmail;
        encryptedPassword: ServerUserConceptEncryptedPassword;
        isAdmin: UserConceptIsAdmin;
        restrictedAccess: UserConceptRestrictedAccess;
        suspendedAccount: UserConceptSuspendedAccount;
        transactionConceptDate: TransactionConceptDate;
    }): ServerUserConcept {
        const id = new UserConceptId(conceptId.shortValue);
        const transactionDate = new UserConceptTransactionDate(
            transactionConceptDate.value,
        );

        return new ServerUserConcept({
            email,
            encryptedPassword,
            id,
            isAdmin,
            restrictedAccess,
            suspendedAccount,
            transactionDate,
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

    public update({
        email,
        isAdmin,
        restrictedAccess,
        suspendedAccount,
    }: {
        email: UserConceptEmail;
        isAdmin: UserConceptIsAdmin;
        restrictedAccess: UserConceptRestrictedAccess;
        suspendedAccount: UserConceptSuspendedAccount;
    }) {
        this.email = email;
        this.isAdmin = isAdmin;
        this.restrictedAccess = restrictedAccess;
        this.suspendedAccount = suspendedAccount;
    }

    public updatePassword({
        encryptedPassword,
    }: {
        encryptedPassword: ServerUserConceptEncryptedPassword;
    }) {
        this.encryptedPassword = encryptedPassword;
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
