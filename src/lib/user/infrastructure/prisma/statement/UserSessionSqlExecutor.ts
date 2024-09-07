import type { PrismaTransaction } from "../../../../shared/infrastructure/prisma/model/Prisma";
import type { ServerUserSessionFilter } from "../../../domain/model/ServerUserSession";
import type { ServerUserSessionSearchCriteria } from "../../../domain/model/ServerUserSession";
import type { UserSessionId } from "../../../domain/model/UserSession";
import { DbUserSession } from "../model/DbUserSession";
import { UnexpectedDatabaseErrorException } from "../../../../shared/domain/model/DomainException";

export class UserSessionSqlExecutor {
    public static async delete(
        tx: PrismaTransaction,
        userSessionId: UserSessionId,
    ): Promise<void> {
        try {
            await tx.user_session.delete({
                where: { id: userSessionId.longValue },
            });
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }

    public static async insert(
        tx: PrismaTransaction,
        dbUserSession: DbUserSession,
    ): Promise<void> {
        try {
            await tx.user_session.create({ data: dbUserSession });
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }

    public static async insertInBulk(
        tx: PrismaTransaction,
        dbUserSessions: DbUserSession[],
    ): Promise<void> {
        try {
            await tx.user_session.createMany({ data: dbUserSessions });
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }

    public static async select(
        tx: PrismaTransaction,
        searchCriteria: ServerUserSessionSearchCriteria,
    ): Promise<DbUserSession[]> {
        try {
            const dbFilterWhere =
                undefined == searchCriteria.filters
                    ? undefined
                    : DbUserSession.toDbServerFilterWhere(
                          searchCriteria.filters,
                      );
            const dbOrderBy =
                undefined == searchCriteria.orderBy
                    ? undefined
                    : DbUserSession.toDbServerOrderBy(searchCriteria.orderBy);

            const results = await tx.user_session.findMany({
                where: dbFilterWhere,
                skip: searchCriteria.pagination?.itemsToSkip,
                take: searchCriteria.pagination?.itemsPerPage,
                orderBy: dbOrderBy,
            });

            const dbUserSessions = results.map((r) => new DbUserSession(r));
            return dbUserSessions;
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }

    public static async update(
        tx: PrismaTransaction,
        dbUserSession: DbUserSession,
    ): Promise<void> {
        try {
            await tx.user_session.update({
                where: { id: dbUserSession.id },
                data: dbUserSession,
            });
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }

    public static async selectExists(
        tx: PrismaTransaction,
        filters: ServerUserSessionFilter[],
    ): Promise<boolean> {
        try {
            const dbFilterWhere = DbUserSession.toDbServerFilterWhere(filters);

            const result = await tx.user_session.findFirst({
                where: dbFilterWhere,
            });
            return null != result;
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }
}
