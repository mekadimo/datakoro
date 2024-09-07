import type { DbBooleanFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import type { DbDateTimeFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import type { DbFieldOrderDirection } from "../../../../shared/infrastructure/prisma/model/DbFieldOrderDirection";
import type { DbTextFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import type { DbUuidFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import type { PrivateUserConceptFieldOrder } from "../../../domain/model/UserConcept";
import type { PrivateUserConceptFilter } from "../../../domain/model/UserConcept";
import type { PublicUserConceptFieldOrder } from "../../../domain/model/UserConcept";
import type { PublicUserConceptFilter } from "../../../domain/model/UserConcept";
import type { ServerUserConceptFieldOrder } from "../../../domain/model/ServerUserConcept";
import type { ServerUserConceptFilter } from "../../../domain/model/ServerUserConcept";
import { DbModel } from "../../../../shared/infrastructure/prisma/model/DbModel";
import { PrivateUserConceptField } from "../../../domain/model/UserConcept";
import { PublicUserConceptField } from "../../../domain/model/UserConcept";
import { ServerUserConcept } from "../../../domain/model/ServerUserConcept";
import { ServerUserConceptEncryptedPassword } from "../../../domain/model/ServerUserConcept";
import { ServerUserConceptField } from "../../../domain/model/ServerUserConcept";
import { UserConceptEmail } from "../../../domain/model/UserConcept";
import { UserConceptId } from "../../../domain/model/UserConcept";
import { UserConceptIsAdmin } from "../../../domain/model/UserConcept";
import { UserConceptRestrictedAccess } from "../../../domain/model/UserConcept";
import { UserConceptSuspendedAccount } from "../../../domain/model/UserConcept";
import { UserConceptTransactionDate } from "../../../domain/model/UserConcept";

type DbPrivateUserConceptFilter =
    | { concept_id: DbUuidFilter }
    | { email: DbTextFilter }
    | { is_admin: DbBooleanFilter }
    | { restricted_access: DbBooleanFilter }
    | { suspended_account: DbBooleanFilter }
    | { transaction_date: DbDateTimeFilter };

type DbPrivateUserConceptFieldOrder =
    | { concept_id: DbFieldOrderDirection }
    | { email: DbFieldOrderDirection }
    | { is_admin: DbFieldOrderDirection }
    | { restricted_access: DbFieldOrderDirection }
    | { suspended_account: DbFieldOrderDirection }
    | { transaction_date: DbFieldOrderDirection };

type DbPublicUserConceptFilter =
    | { concept_id: DbUuidFilter }
    | { is_admin: DbBooleanFilter }
    | { restricted_access: DbBooleanFilter }
    | { suspended_account: DbBooleanFilter }
    | { transaction_date: DbDateTimeFilter };

type DbPublicUserConceptFieldOrder =
    | { concept_id: DbFieldOrderDirection }
    | { is_admin: DbFieldOrderDirection }
    | { restricted_access: DbFieldOrderDirection }
    | { suspended_account: DbFieldOrderDirection }
    | { transaction_date: DbFieldOrderDirection };

type DbServerUserConceptFilter =
    | { concept_id: DbUuidFilter }
    | { email: DbTextFilter }
    | { is_admin: DbBooleanFilter }
    | { restricted_access: DbBooleanFilter }
    | { suspended_account: DbBooleanFilter }
    | { transaction_date: DbDateTimeFilter };

type DbServerUserConceptFieldOrder =
    | { concept_id: DbFieldOrderDirection }
    | { email: DbFieldOrderDirection }
    | { is_admin: DbFieldOrderDirection }
    | { restricted_access: DbFieldOrderDirection }
    | { suspended_account: DbFieldOrderDirection }
    | { transaction_date: DbFieldOrderDirection };

export class DbUserConcept {
    concept_id: string;
    email: string;
    encrypted_password: string;
    is_admin: boolean;
    restricted_access: boolean;
    suspended_account: boolean;
    transaction_date: Date;

    constructor({
        concept_id,
        email,
        encrypted_password,
        is_admin,
        restricted_access,
        suspended_account,
        transaction_date,
    }: {
        concept_id: string;
        email: string;
        encrypted_password: string;
        is_admin: boolean;
        restricted_access: boolean;
        suspended_account: boolean;
        transaction_date: Date;
    }) {
        this.concept_id = concept_id;
        this.email = email;
        this.encrypted_password = encrypted_password;
        this.is_admin = is_admin;
        this.restricted_access = restricted_access;
        this.suspended_account = suspended_account;
        this.transaction_date = transaction_date;
    }

    public static fromServerDomain(
        serverUserConcept: ServerUserConcept,
    ): DbUserConcept {
        return new DbUserConcept({
            concept_id: serverUserConcept.id.longValue,
            email: serverUserConcept.email.value,
            encrypted_password: serverUserConcept.encryptedPassword.value,
            is_admin: serverUserConcept.isAdmin.value,
            restricted_access: serverUserConcept.restrictedAccess.value,
            suspended_account: serverUserConcept.suspendedAccount.value,
            transaction_date: serverUserConcept.transactionDate.value,
        });
    }

    public static toDbPrivateFilter(
        filter: PrivateUserConceptFilter,
    ): DbPrivateUserConceptFilter {
        switch (filter.field) {
            case PrivateUserConceptField.Email: {
                return {
                    email: DbModel.toDbTextFilter(filter.filter),
                };
            }
            case PrivateUserConceptField.Id: {
                return {
                    concept_id: DbModel.toDbUuidFilter(filter.filter),
                };
            }
            case PrivateUserConceptField.IsAdmin: {
                return {
                    is_admin: DbModel.toDbBooleanFilter(filter.filter),
                };
            }
            case PrivateUserConceptField.RestrictedAccess: {
                return {
                    restricted_access: DbModel.toDbBooleanFilter(filter.filter),
                };
            }
            case PrivateUserConceptField.SuspendedAccount: {
                return {
                    suspended_account: DbModel.toDbBooleanFilter(filter.filter),
                };
            }
            case PrivateUserConceptField.TransactionDate: {
                return {
                    transaction_date: DbModel.toDbDateTimeFilter(filter.filter),
                };
            }
        }
    }

    public static toDbPrivateFilterWhere(filters: PrivateUserConceptFilter[]): {
        AND: DbPrivateUserConceptFilter[];
    } {
        const dbFilters = filters.map((f) =>
            DbUserConcept.toDbPrivateFilter(f),
        );
        return { AND: dbFilters };
    }

    public static toDbPrivateOrder(
        order: PrivateUserConceptFieldOrder,
    ): DbPrivateUserConceptFieldOrder {
        switch (order.field) {
            case PrivateUserConceptField.Email: {
                return {
                    email: DbModel.toDbOrderDirection(order.direction),
                };
            }
            case PrivateUserConceptField.Id: {
                return {
                    concept_id: DbModel.toDbOrderDirection(order.direction),
                };
            }
            case PrivateUserConceptField.IsAdmin: {
                return {
                    is_admin: DbModel.toDbOrderDirection(order.direction),
                };
            }
            case PrivateUserConceptField.RestrictedAccess: {
                return {
                    restricted_access: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case PrivateUserConceptField.SuspendedAccount: {
                return {
                    suspended_account: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case PrivateUserConceptField.TransactionDate: {
                return {
                    transaction_date: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
        }
    }

    public static toDbPrivateOrderBy(
        orderBy: PrivateUserConceptFieldOrder[],
    ): DbPrivateUserConceptFieldOrder[] {
        const dbOrderBy = orderBy.map((o) => DbUserConcept.toDbPrivateOrder(o));
        return dbOrderBy;
    }

    public static toDbPublicFilter(
        filter: PublicUserConceptFilter,
    ): DbPublicUserConceptFilter {
        switch (filter.field) {
            case PublicUserConceptField.Id: {
                return {
                    concept_id: DbModel.toDbUuidFilter(filter.filter),
                };
            }
            case PublicUserConceptField.IsAdmin: {
                return {
                    is_admin: DbModel.toDbBooleanFilter(filter.filter),
                };
            }
            case PublicUserConceptField.RestrictedAccess: {
                return {
                    restricted_access: DbModel.toDbBooleanFilter(filter.filter),
                };
            }
            case PublicUserConceptField.SuspendedAccount: {
                return {
                    suspended_account: DbModel.toDbBooleanFilter(filter.filter),
                };
            }
            case PublicUserConceptField.TransactionDate: {
                return {
                    transaction_date: DbModel.toDbDateTimeFilter(filter.filter),
                };
            }
        }
    }

    public static toDbPublicFilterWhere(filters: PublicUserConceptFilter[]): {
        AND: DbPublicUserConceptFilter[];
    } {
        const dbFilters = filters.map((f) => DbUserConcept.toDbPublicFilter(f));
        return { AND: dbFilters };
    }

    public static toDbPublicOrder(
        order: PublicUserConceptFieldOrder,
    ): DbPublicUserConceptFieldOrder {
        switch (order.field) {
            case PublicUserConceptField.Id: {
                return {
                    concept_id: DbModel.toDbOrderDirection(order.direction),
                };
            }
            case PublicUserConceptField.IsAdmin: {
                return {
                    is_admin: DbModel.toDbOrderDirection(order.direction),
                };
            }
            case PublicUserConceptField.RestrictedAccess: {
                return {
                    restricted_access: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case PublicUserConceptField.SuspendedAccount: {
                return {
                    suspended_account: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case PublicUserConceptField.TransactionDate: {
                return {
                    transaction_date: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
        }
    }

    public static toDbPublicOrderBy(
        orderBy: PublicUserConceptFieldOrder[],
    ): DbPublicUserConceptFieldOrder[] {
        const dbOrderBy = orderBy.map((o) => DbUserConcept.toDbPublicOrder(o));
        return dbOrderBy;
    }

    public static toDbServerFilter(
        filter: ServerUserConceptFilter,
    ): DbServerUserConceptFilter {
        switch (filter.field) {
            case ServerUserConceptField.Email: {
                return {
                    email: DbModel.toDbTextFilter(filter.filter),
                };
            }
            case ServerUserConceptField.Id: {
                return {
                    concept_id: DbModel.toDbUuidFilter(filter.filter),
                };
            }
            case ServerUserConceptField.IsAdmin: {
                return {
                    is_admin: DbModel.toDbBooleanFilter(filter.filter),
                };
            }
            case ServerUserConceptField.RestrictedAccess: {
                return {
                    restricted_access: DbModel.toDbBooleanFilter(filter.filter),
                };
            }
            case ServerUserConceptField.SuspendedAccount: {
                return {
                    suspended_account: DbModel.toDbBooleanFilter(filter.filter),
                };
            }
            case ServerUserConceptField.TransactionDate: {
                return {
                    transaction_date: DbModel.toDbDateTimeFilter(filter.filter),
                };
            }
        }
    }

    public static toDbServerFilterWhere(filters: ServerUserConceptFilter[]): {
        AND: DbServerUserConceptFilter[];
    } {
        const dbFilters = filters.map((f) => DbUserConcept.toDbServerFilter(f));
        return { AND: dbFilters };
    }

    public static toDbServerOrder(
        order: ServerUserConceptFieldOrder,
    ): DbServerUserConceptFieldOrder {
        switch (order.field) {
            case ServerUserConceptField.Email: {
                return {
                    email: DbModel.toDbOrderDirection(order.direction),
                };
            }
            case ServerUserConceptField.Id: {
                return {
                    concept_id: DbModel.toDbOrderDirection(order.direction),
                };
            }
            case ServerUserConceptField.IsAdmin: {
                return {
                    is_admin: DbModel.toDbOrderDirection(order.direction),
                };
            }
            case ServerUserConceptField.RestrictedAccess: {
                return {
                    restricted_access: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case ServerUserConceptField.SuspendedAccount: {
                return {
                    suspended_account: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case ServerUserConceptField.TransactionDate: {
                return {
                    transaction_date: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
        }
    }

    public static toDbServerOrderBy(
        orderBy: ServerUserConceptFieldOrder[],
    ): DbServerUserConceptFieldOrder[] {
        const dbOrderBy = orderBy.map((o) => DbUserConcept.toDbServerOrder(o));
        return dbOrderBy;
    }

    public toServerDomain(): ServerUserConcept {
        return new ServerUserConcept({
            email: new UserConceptEmail(this.email),
            encryptedPassword: new ServerUserConceptEncryptedPassword(
                this.encrypted_password,
            ),
            id: new UserConceptId(this.concept_id),
            isAdmin: new UserConceptIsAdmin(this.is_admin),
            restrictedAccess: new UserConceptRestrictedAccess(
                this.restricted_access,
            ),
            suspendedAccount: new UserConceptSuspendedAccount(
                this.suspended_account,
            ),
            transactionDate: new UserConceptTransactionDate(
                this.transaction_date,
            ),
        });
    }
}
