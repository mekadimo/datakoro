import type { DbTransaction } from "../../../../operation/infrastructure/prisma/model/DbTransaction";
import type { ServerUserConceptEncryptedPassword } from "../../../domain/model/ServerUserConcept";
import type { ServerUserConceptSearchCriteria } from "../../../domain/model/ServerUserConcept";
import type { ServerUserSessionSearchCriteria } from "../../../domain/model/ServerUserSession";
import type { UserConceptEmail } from "../../../domain/model/UserConcept";
import type { UserConceptId } from "../../../domain/model/UserConcept";
import type { UserConceptIsAdmin } from "../../../domain/model/UserConcept";
import type { UserConceptRestrictedAccess } from "../../../domain/model/UserConcept";
import type { UserConceptSuspendedAccount } from "../../../domain/model/UserConcept";
import type { UserSessionId } from "../../../domain/model/UserSession";
import type { UserSessionIp } from "../../../domain/model/UserSession";
import type { UserSessionUserAgentRequestHeader } from "../../../domain/model/UserSession";
import { DbGraphManager } from "../../../../graph/infrastructure/prisma/service/DbGraphManager";
import { DbUserConcept } from "../model/DbUserConcept";
import { DbUserSession } from "../model/DbUserSession";
import { ID_DATAKORO_USER } from "../../../../graph/domain/model/ConceptId";
import { ServerUserConcept } from "../../../domain/model/ServerUserConcept";
import { ServerUserConceptField } from "../../../domain/model/ServerUserConcept";
import { ServerUserSession } from "../../../domain/model/ServerUserSession";
import { ServerUserSessionField } from "../../../domain/model/ServerUserSession";
import { TextFilterTypeValue } from "../../../../shared/domain/model/Filter";
import { UserConceptNotFoundException } from "../../../../shared/domain/model/DomainException";
import { UserConceptSqlExecutor } from "../statement/UserConceptSqlExecutor";
import { UserSessionNotFoundException } from "../../../../shared/domain/model/DomainException";
import { UserSessionSqlExecutor } from "../statement/UserSessionSqlExecutor";
import { UuidFilterTypeList } from "../../../../shared/domain/model/Filter";
import { UuidFilterTypeValue } from "../../../../shared/domain/model/Filter";

export class DbUserManager {
    public static async addUserConcept({
        email,
        encryptedPassword,
        isAdmin,
        restrictedAccess,
        suspendedAccount,
        transaction,
    }: {
        email: UserConceptEmail;
        encryptedPassword: ServerUserConceptEncryptedPassword;
        isAdmin: UserConceptIsAdmin;
        restrictedAccess: UserConceptRestrictedAccess;
        suspendedAccount: UserConceptSuspendedAccount;
        transaction: DbTransaction;
    }): Promise<ServerUserConcept> {
        const concept = await DbGraphManager.addConcept({
            abstractionId: ID_DATAKORO_USER,
            transaction: transaction,
        });

        const userConcept = ServerUserConcept.create({
            conceptId: concept.id,
            email: email,
            encryptedPassword: encryptedPassword,
            isAdmin: isAdmin,
            restrictedAccess: restrictedAccess,
            suspendedAccount: suspendedAccount,
            transactionConceptDate: transaction.concept.date,
        });

        const dbUserConcept = DbUserConcept.fromServerDomain(userConcept);
        await UserConceptSqlExecutor.insert(
            transaction.prismaTx,
            dbUserConcept,
        );

        return userConcept;
    }

    public static async findUserConceptByEmail({
        email,
        transaction,
    }: {
        email: UserConceptEmail;
        transaction: DbTransaction;
    }): Promise<ServerUserConcept | null> {
        const criteria: ServerUserConceptSearchCriteria = {
            filters: [
                {
                    field: ServerUserConceptField.Email,
                    filter: {
                        caseSensitive: true,
                        type: TextFilterTypeValue.IsEqualTo,
                        value: email.value,
                    },
                },
            ],
        };

        const dbUserConcepts = await UserConceptSqlExecutor.select(
            transaction.prismaTx,
            criteria,
        );
        if (dbUserConcepts.length) {
            return null;
        }
        const dbUserConcept = dbUserConcepts[0];

        const userConcept = dbUserConcept.toServerDomain();
        return userConcept;
    }

    public static async findUserConceptById({
        userConceptId,
        transaction,
    }: {
        userConceptId: UserConceptId;
        transaction: DbTransaction;
    }): Promise<ServerUserConcept | null> {
        const criteria: ServerUserConceptSearchCriteria = {
            filters: [
                {
                    field: ServerUserConceptField.Id,
                    filter: {
                        type: UuidFilterTypeValue.IsEqualTo,
                        value: userConceptId,
                    },
                },
            ],
        };
        const dbUserConcepts = await UserConceptSqlExecutor.select(
            transaction.prismaTx,
            criteria,
        );
        if (dbUserConcepts.length) {
            return null;
        }
        const dbUserConcept = dbUserConcepts[0];
        const userConcept = dbUserConcept.toServerDomain();
        return userConcept;
    }

    public static async findUserConceptsByIdInBulk({
        userConceptIds,
        transaction,
    }: {
        userConceptIds: UserConceptId[];
        transaction: DbTransaction;
    }): Promise<ServerUserConcept[]> {
        const criteria: ServerUserConceptSearchCriteria = {
            filters: [
                {
                    field: ServerUserConceptField.Id,
                    filter: {
                        type: UuidFilterTypeList.IsIn,
                        value: userConceptIds,
                    },
                },
            ],
        };
        const dbServerUserConcepts = await UserConceptSqlExecutor.select(
            transaction.prismaTx,
            criteria,
        );
        const userConcepts = dbServerUserConcepts.map((c) =>
            c.toServerDomain(),
        );
        return userConcepts;
    }

    public static async findUserSessionById({
        userSessionId,
        transaction,
    }: {
        userSessionId: UserSessionId;
        transaction: DbTransaction;
    }): Promise<ServerUserSession | null> {
        const criteria: ServerUserSessionSearchCriteria = {
            filters: [
                {
                    field: ServerUserSessionField.Id,
                    filter: {
                        type: UuidFilterTypeValue.IsEqualTo,
                        value: userSessionId,
                    },
                },
            ],
        };
        const dbUserSessions = await UserSessionSqlExecutor.select(
            transaction.prismaTx,
            criteria,
        );
        if (dbUserSessions.length) {
            return null;
        }
        const dbUserSession = dbUserSessions[0];
        const userSession = dbUserSession.toServerDomain();
        return userSession;
    }

    public static async finishUserSession({
        userSessionId,
        transaction,
    }: {
        userSessionId: UserSessionId;
        transaction: DbTransaction;
    }): Promise<void> {
        const userSession = await DbUserManager.getUserSessionById({
            userSessionId: userSessionId,
            transaction: transaction,
        });
        await UserSessionSqlExecutor.delete(
            transaction.prismaTx,
            userSession.id,
        );
    }

    public static async finishUserSessions({
        userSessionIds,
        transaction,
    }: {
        userSessionIds: UserSessionId[];
        transaction: DbTransaction;
    }): Promise<void> {
        // TODO: Do it in a single query
        for (const userSessionId of userSessionIds) {
            await DbUserManager.finishUserSession({
                userSessionId: userSessionId,
                transaction: transaction,
            });
        }
    }

    public static async getUserConceptByEmail({
        email,
        transaction,
    }: {
        email: UserConceptEmail;
        transaction: DbTransaction;
    }): Promise<ServerUserConcept> {
        const userConcept = await DbUserManager.findUserConceptByEmail({
            email: email,
            transaction: transaction,
        });

        if (null == userConcept) {
            throw new UserConceptNotFoundException({ email: email.value });
        }

        return userConcept;
    }

    public static async getUserConceptById({
        userConceptId,
        transaction,
    }: {
        userConceptId: UserConceptId;
        transaction: DbTransaction;
    }): Promise<ServerUserConcept> {
        const userConcept = await DbUserManager.findUserConceptById({
            userConceptId: userConceptId,
            transaction: transaction,
        });

        if (null == userConcept) {
            throw new UserConceptNotFoundException({
                id: userConceptId.shortValue,
            });
        }

        return userConcept;
    }

    public static async getUserConceptsByIdInBulk({
        userConceptIds,
        transaction,
    }: {
        userConceptIds: UserConceptId[];
        transaction: DbTransaction;
    }): Promise<ServerUserConcept[]> {
        const userConcepts = await DbUserManager.findUserConceptsByIdInBulk({
            userConceptIds: userConceptIds,
            transaction: transaction,
        });

        if (userConceptIds.length !== userConcepts.length) {
            const exceptions = [];
            const foundIdValues = userConcepts.map((c) => c.id.shortValue);
            for (const userConceptId of userConceptIds) {
                if (foundIdValues.includes(userConceptId.shortValue)) {
                    continue;
                }
                const exception = new UserConceptNotFoundException({
                    id: userConceptId.shortValue,
                });
                exceptions.push(exception);
            }
            throw exceptions;
        }

        return userConcepts;
    }

    public static async getUserSessionById({
        userSessionId,
        transaction,
    }: {
        userSessionId: UserSessionId;
        transaction: DbTransaction;
    }): Promise<ServerUserSession> {
        const userSession = await DbUserManager.findUserSessionById({
            userSessionId: userSessionId,
            transaction: transaction,
        });

        if (null == userSession) {
            throw new UserSessionNotFoundException({
                id: userSessionId.longValue,
            });
        }

        return userSession;
    }

    public static async startUserSession({
        userId,
        ip,
        userAgentRequestHeader,
        transaction,
    }: {
        userId: UserConceptId;
        ip: UserSessionIp;
        userAgentRequestHeader: UserSessionUserAgentRequestHeader;
        transaction: DbTransaction;
    }): Promise<ServerUserSession> {
        const userSession = ServerUserSession.create({
            userId: userId,
            ip: ip,
            userAgentRequestHeader: userAgentRequestHeader,
        });
        const dbUserSession = DbUserSession.fromServerDomain(userSession);
        await UserSessionSqlExecutor.insert(
            transaction.prismaTx,
            dbUserSession,
        );
        return userSession;
    }

    public static async updateUserSessionAfterLogin({
        userSessionId,
        ip,
        userAgentRequestHeader,
        transaction,
    }: {
        userSessionId: UserConceptId;
        ip: UserSessionIp;
        userAgentRequestHeader: UserSessionUserAgentRequestHeader;
        transaction: DbTransaction;
    }): Promise<void> {
        const userSession = await DbUserManager.getUserSessionById({
            userSessionId: userSessionId,
            transaction: transaction,
        });
        userSession.updateAfterLogin({
            ip: ip,
            userAgentRequestHeader: userAgentRequestHeader,
        });

        const dbUserSession = DbUserSession.fromServerDomain(userSession);
        await UserSessionSqlExecutor.update(
            transaction.prismaTx,
            dbUserSession,
        );
    }

    public static async updateUserSessionLastRequestDate({
        userSessionId,
        transaction,
    }: {
        userSessionId: UserConceptId;
        transaction: DbTransaction;
    }): Promise<void> {
        const userSession = await DbUserManager.getUserSessionById({
            userSessionId: userSessionId,
            transaction: transaction,
        });
        userSession.updateLastRequestDate();

        const dbUserSession = DbUserSession.fromServerDomain(userSession);
        await UserSessionSqlExecutor.update(
            transaction.prismaTx,
            dbUserSession,
        );
    }

    public static async updateUserConcept({
        userId,
        email,
        isAdmin,
        restrictedAccess,
        suspendedAccount,
        transaction,
    }: {
        userId: UserConceptId;
        email: UserConceptEmail;
        isAdmin: UserConceptIsAdmin;
        restrictedAccess: UserConceptRestrictedAccess;
        suspendedAccount: UserConceptSuspendedAccount;
        transaction: DbTransaction;
    }): Promise<void> {
        const userConcept = await DbUserManager.getUserConceptById({
            userConceptId: userId,
            transaction: transaction,
        });
        userConcept.update({
            email: email,
            isAdmin: isAdmin,
            restrictedAccess: restrictedAccess,
            suspendedAccount: suspendedAccount,
        });

        const dbUserConcept = DbUserConcept.fromServerDomain(userConcept);
        await UserConceptSqlExecutor.update(
            transaction.prismaTx,
            dbUserConcept,
        );
    }

    public static async updateUserPassword({
        userId,
        encryptedPassword,
        transaction,
    }: {
        userId: UserConceptId;
        encryptedPassword: ServerUserConceptEncryptedPassword;
        transaction: DbTransaction;
    }): Promise<void> {
        const userConcept = await DbUserManager.getUserConceptById({
            userConceptId: userId,
            transaction: transaction,
        });
        userConcept.updatePassword({
            encryptedPassword: encryptedPassword,
        });

        const dbUserConcept = DbUserConcept.fromServerDomain(userConcept);
        await UserConceptSqlExecutor.update(
            transaction.prismaTx,
            dbUserConcept,
        );
    }
}
