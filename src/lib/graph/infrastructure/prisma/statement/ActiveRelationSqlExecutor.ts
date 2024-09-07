import type { ActiveRelationFilter } from "../../../domain/model/Relation";
import type { ActiveRelationSearchCriteria } from "../../../domain/model/Relation";
import type { PrismaTransaction } from "../../../../shared/infrastructure/prisma/model/Prisma";
import { DbActiveRelation } from "../model/DbActiveRelation";
import { UnexpectedDatabaseErrorException } from "../../../../shared/domain/model/DomainException";

export class ActiveRelationSqlExecutor {
    public static async select(
        tx: PrismaTransaction,
        searchCriteria: ActiveRelationSearchCriteria,
    ): Promise<DbActiveRelation[]> {
        try {
            const dbFilterWhere =
                undefined == searchCriteria.filters
                    ? undefined
                    : DbActiveRelation.toDbFilterWhere(searchCriteria.filters);
            const dbOrderBy =
                undefined == searchCriteria.orderBy
                    ? undefined
                    : DbActiveRelation.toDbOrderBy(searchCriteria.orderBy);

            const results = await tx.active_relation.findMany({
                where: dbFilterWhere,
                skip: searchCriteria.pagination?.itemsToSkip,
                take: searchCriteria.pagination?.itemsPerPage,
                orderBy: dbOrderBy,
            });

            const dbActiveRelations = results.map(
                (r) => new DbActiveRelation(r),
            );
            return dbActiveRelations;
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }

    public static async selectExists(
        tx: PrismaTransaction,
        filters: ActiveRelationFilter[],
    ): Promise<boolean> {
        try {
            const dbFilterWhere = DbActiveRelation.toDbFilterWhere(filters);

            const result = await tx.active_relation.findFirst({
                where: dbFilterWhere,
            });
            return null != result;
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }
}
