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
    public static async addUserConcept(input: {
        email: UserConceptEmail;
        encryptedPassword: ServerUserConceptEncryptedPassword;
        isAdmin: UserConceptIsAdmin;
        restrictedAccess: UserConceptRestrictedAccess;
        suspendedAccount: UserConceptSuspendedAccount;
        transaction: DbTransaction;
    }): Promise<ServerUserConcept> {
        const concept = await DbGraphManager.addConcept({
            abstractionId: ID_DATAKORO_USER,
            transaction: input.transaction,
        });

        const userConcept = ServerUserConcept.create({
            conceptId: concept.id,
            email: input.email,
            encryptedPassword: input.encryptedPassword,
            isAdmin: input.isAdmin,
            restrictedAccess: input.restrictedAccess,
            suspendedAccount: input.suspendedAccount,
            transactionConceptDate: input.transaction.concept.date,
        });

        const dbUserConcept = DbUserConcept.fromServerDomain(userConcept);
        await UserConceptSqlExecutor.insert(
            input.transaction.prismaTx,
            dbUserConcept,
        );

        return userConcept;
    }

    public static async findUserConceptByEmail(input: {
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
                        value: input.email.value,
                    },
                },
            ],
        };

        const dbUserConcepts = await UserConceptSqlExecutor.select(
            input.transaction.prismaTx,
            criteria,
        );
        if (dbUserConcepts.length) {
            return null;
        }
        const dbUserConcept = dbUserConcepts[0];

        const userConcept = dbUserConcept.toServerDomain();
        return userConcept;
    }

    public static async findUserConceptById(input: {
        userConceptId: UserConceptId;
        transaction: DbTransaction;
    }): Promise<ServerUserConcept | null> {
        const criteria: ServerUserConceptSearchCriteria = {
            filters: [
                {
                    field: ServerUserConceptField.Id,
                    filter: {
                        type: UuidFilterTypeValue.IsEqualTo,
                        value: input.userConceptId,
                    },
                },
            ],
        };
        const dbUserConcepts = await UserConceptSqlExecutor.select(
            input.transaction.prismaTx,
            criteria,
        );
        if (dbUserConcepts.length) {
            return null;
        }
        const dbUserConcept = dbUserConcepts[0];
        const userConcept = dbUserConcept.toServerDomain();
        return userConcept;
    }

    public static async findUserConceptsByIdInBulk(input: {
        userConceptIds: UserConceptId[];
        transaction: DbTransaction;
    }): Promise<ServerUserConcept[]> {
        const criteria: ServerUserConceptSearchCriteria = {
            filters: [
                {
                    field: ServerUserConceptField.Id,
                    filter: {
                        type: UuidFilterTypeList.IsIn,
                        value: input.userConceptIds,
                    },
                },
            ],
        };
        const dbServerUserConcepts = await UserConceptSqlExecutor.select(
            input.transaction.prismaTx,
            criteria,
        );
        const userConcepts = dbServerUserConcepts.map((c) =>
            c.toServerDomain(),
        );
        return userConcepts;
    }

    public static async findUserSessionById(input: {
        userSessionId: UserSessionId;
        transaction: DbTransaction;
    }): Promise<ServerUserSession | null> {
        const criteria: ServerUserSessionSearchCriteria = {
            filters: [
                {
                    field: ServerUserSessionField.Id,
                    filter: {
                        type: UuidFilterTypeValue.IsEqualTo,
                        value: input.userSessionId,
                    },
                },
            ],
        };
        const dbUserSessions = await UserSessionSqlExecutor.select(
            input.transaction.prismaTx,
            criteria,
        );
        if (dbUserSessions.length) {
            return null;
        }
        const dbUserSession = dbUserSessions[0];
        const userSession = dbUserSession.toServerDomain();
        return userSession;
    }

    public static async finishUserSession(input: {
        userSessionId: UserSessionId;
        transaction: DbTransaction;
    }): Promise<void> {
        const userSession = await DbUserManager.getUserSessionById({
            userSessionId: input.userSessionId,
            transaction: input.transaction,
        });
        await UserSessionSqlExecutor.delete(
            input.transaction.prismaTx,
            userSession.id,
        );
    }

    public static async finishUserSessions(input: {
        userSessionIds: UserSessionId[];
        transaction: DbTransaction;
    }): Promise<void> {
        // TODO: Do it in a single query
        for (const userSessionId of input.userSessionIds) {
            await DbUserManager.finishUserSession({
                userSessionId: userSessionId,
                transaction: input.transaction,
            });
        }
    }

    public static async getUserConceptByEmail(input: {
        email: UserConceptEmail;
        transaction: DbTransaction;
    }): Promise<ServerUserConcept> {
        const userConcept = await DbUserManager.findUserConceptByEmail({
            email: input.email,
            transaction: input.transaction,
        });

        if (null == userConcept) {
            throw new UserConceptNotFoundException({
                email: input.email.value,
            });
        }

        return userConcept;
    }

    public static async getUserConceptById(input: {
        userConceptId: UserConceptId;
        transaction: DbTransaction;
    }): Promise<ServerUserConcept> {
        const userConcept = await DbUserManager.findUserConceptById({
            userConceptId: input.userConceptId,
            transaction: input.transaction,
        });

        if (null == userConcept) {
            throw new UserConceptNotFoundException({
                id: input.userConceptId.shortValue,
            });
        }

        return userConcept;
    }

    public static async getUserConceptsByIdInBulk(input: {
        userConceptIds: UserConceptId[];
        transaction: DbTransaction;
    }): Promise<ServerUserConcept[]> {
        const userConcepts = await DbUserManager.findUserConceptsByIdInBulk({
            userConceptIds: input.userConceptIds,
            transaction: input.transaction,
        });

        if (input.userConceptIds.length !== userConcepts.length) {
            const exceptions = [];
            const foundIdValues = userConcepts.map((c) => c.id.shortValue);
            for (const userConceptId of input.userConceptIds) {
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

    public static async getUserSessionById(input: {
        userSessionId: UserSessionId;
        transaction: DbTransaction;
    }): Promise<ServerUserSession> {
        const userSession = await DbUserManager.findUserSessionById({
            userSessionId: input.userSessionId,
            transaction: input.transaction,
        });

        if (null == userSession) {
            throw new UserSessionNotFoundException({
                id: input.userSessionId.longValue,
            });
        }

        return userSession;
    }

    public static async startUserSession(input: {
        userId: UserConceptId;
        ip: UserSessionIp;
        userAgentRequestHeader: UserSessionUserAgentRequestHeader;
        transaction: DbTransaction;
    }): Promise<ServerUserSession> {
        const userSession = ServerUserSession.create({
            userId: input.userId,
            ip: input.ip,
            userAgentRequestHeader: input.userAgentRequestHeader,
        });
        const dbUserSession = DbUserSession.fromServerDomain(userSession);
        await UserSessionSqlExecutor.insert(
            input.transaction.prismaTx,
            dbUserSession,
        );
        return userSession;
    }

    public static async updateUserSessionAfterLogin(input: {
        userSessionId: UserConceptId;
        ip: UserSessionIp;
        userAgentRequestHeader: UserSessionUserAgentRequestHeader;
        transaction: DbTransaction;
    }): Promise<void> {
        const userSession = await DbUserManager.getUserSessionById({
            userSessionId: input.userSessionId,
            transaction: input.transaction,
        });
        userSession.updateAfterLogin({
            ip: input.ip,
            userAgentRequestHeader: input.userAgentRequestHeader,
        });

        const dbUserSession = DbUserSession.fromServerDomain(userSession);
        await UserSessionSqlExecutor.update(
            input.transaction.prismaTx,
            dbUserSession,
        );
    }

    public static async updateUserSessionLastRequestDate(input: {
        userSessionId: UserConceptId;
        transaction: DbTransaction;
    }): Promise<void> {
        const userSession = await DbUserManager.getUserSessionById({
            userSessionId: input.userSessionId,
            transaction: input.transaction,
        });
        userSession.updateLastRequestDate();

        const dbUserSession = DbUserSession.fromServerDomain(userSession);
        await UserSessionSqlExecutor.update(
            input.transaction.prismaTx,
            dbUserSession,
        );
    }

    public static async updateUserConcept(input: {
        userId: UserConceptId;
        email: UserConceptEmail;
        isAdmin: UserConceptIsAdmin;
        restrictedAccess: UserConceptRestrictedAccess;
        suspendedAccount: UserConceptSuspendedAccount;
        transaction: DbTransaction;
    }): Promise<void> {
        const userConcept = await DbUserManager.getUserConceptById({
            userConceptId: input.userId,
            transaction: input.transaction,
        });
        userConcept.update({
            email: input.email,
            isAdmin: input.isAdmin,
            restrictedAccess: input.restrictedAccess,
            suspendedAccount: input.suspendedAccount,
        });

        const dbUserConcept = DbUserConcept.fromServerDomain(userConcept);
        await UserConceptSqlExecutor.update(
            input.transaction.prismaTx,
            dbUserConcept,
        );
    }

    public static async updateUserPassword(input: {
        userId: UserConceptId;
        encryptedPassword: ServerUserConceptEncryptedPassword;
        transaction: DbTransaction;
    }): Promise<void> {
        const userConcept = await DbUserManager.getUserConceptById({
            userConceptId: input.userId,
            transaction: input.transaction,
        });
        userConcept.updatePassword(input.encryptedPassword);

        const dbUserConcept = DbUserConcept.fromServerDomain(userConcept);
        await UserConceptSqlExecutor.update(
            input.transaction.prismaTx,
            dbUserConcept,
        );
    }
}
