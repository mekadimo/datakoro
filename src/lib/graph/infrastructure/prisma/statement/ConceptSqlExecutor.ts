import type { ConceptFilter } from "../../../domain/model/Concept";
import type { ConceptSearchCriteria } from "../../../domain/model/Concept";
import type { PrismaTransaction } from "../../../../shared/infrastructure/prisma/model/Prisma";
import { DbConcept } from "../model/DbConcept";
import { UnexpectedDatabaseErrorException } from "../../../../shared/domain/model/DomainException";

export class ConceptSqlExecutor {
    public static async insert(
        tx: PrismaTransaction,
        dbConcept: DbConcept,
    ): Promise<void> {
        try {
            await tx.concept.create({ data: dbConcept });
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }

    public static async insertInBulk(
        tx: PrismaTransaction,
        dbConcepts: DbConcept[],
    ): Promise<void> {
        try {
            await tx.concept.createMany({ data: dbConcepts });
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }

    public static async select(
        tx: PrismaTransaction,
        searchCriteria: ConceptSearchCriteria,
    ): Promise<DbConcept[]> {
        try {
            const dbFilterWhere =
                undefined == searchCriteria.filters
                    ? undefined
                    : DbConcept.toDbFilterWhere(searchCriteria.filters);
            const dbOrderBy =
                undefined == searchCriteria.orderBy
                    ? undefined
                    : DbConcept.toDbOrderBy(searchCriteria.orderBy);

            const results = await tx.concept.findMany({
                where: dbFilterWhere,
                skip: searchCriteria.pagination?.itemsToSkip,
                take: searchCriteria.pagination?.itemsPerPage,
                orderBy: dbOrderBy,
            });

            const dbConcepts = results.map((r) => new DbConcept(r));
            return dbConcepts;
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }

    public static async selectExists(
        tx: PrismaTransaction,
        filters: ConceptFilter[],
    ): Promise<boolean> {
        try {
            const dbFilterWhere = DbConcept.toDbFilterWhere(filters);

            const result = await tx.concept.findFirst({
                where: dbFilterWhere,
            });
            return null != result;
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }
}
