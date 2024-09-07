import type { RawRelationFilter } from "../../../domain/model/Relation";
import type { RawRelationSearchCriteria } from "../../../domain/model/Relation";
import type { PrismaTransaction } from "../../../../shared/infrastructure/prisma/model/Prisma";
import { DbRawRelation } from "../model/DbRawRelation";
import { UnexpectedDatabaseErrorException } from "../../../../shared/domain/model/DomainException";

export class RawRelationSqlExecutor {
    public static async insert(
        tx: PrismaTransaction,
        dbRawRelation: DbRawRelation,
    ): Promise<void> {
        try {
            await tx.relation.create({ data: dbRawRelation });
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }

    public static async insertInBulk(
        tx: PrismaTransaction,
        dbRawRelations: DbRawRelation[],
    ): Promise<void> {
        try {
            await tx.relation.createMany({ data: dbRawRelations });
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }

    public static async select(
        tx: PrismaTransaction,
        searchCriteria: RawRelationSearchCriteria,
    ): Promise<DbRawRelation[]> {
        try {
            const dbFilterWhere =
                undefined == searchCriteria.filters
                    ? undefined
                    : DbRawRelation.toDbFilterWhere(searchCriteria.filters);
            const dbOrderBy =
                undefined == searchCriteria.orderBy
                    ? undefined
                    : DbRawRelation.toDbOrderBy(searchCriteria.orderBy);

            const results = await tx.relation.findMany({
                where: dbFilterWhere,
                skip: searchCriteria.pagination?.itemsToSkip,
                take: searchCriteria.pagination?.itemsPerPage,
                orderBy: dbOrderBy,
            });

            const dbRawRelations = results.map((r) => new DbRawRelation(r));
            return dbRawRelations;
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }

    public static async selectExists(
        tx: PrismaTransaction,
        filters: RawRelationFilter[],
    ): Promise<boolean> {
        try {
            const dbFilterWhere = DbRawRelation.toDbFilterWhere(filters);

            const result = await tx.relation.findFirst({
                where: dbFilterWhere,
            });
            return null != result;
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }
}
