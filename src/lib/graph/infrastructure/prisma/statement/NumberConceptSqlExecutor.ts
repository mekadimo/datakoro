import type { NumberConceptFilter } from "../../../domain/model/NumberConcept";
import type { NumberConceptSearchCriteria } from "../../../domain/model/NumberConcept";
import type { PrismaTransaction } from "../../../../shared/infrastructure/prisma/model/Prisma";
import { DbNumberConcept } from "../model/DbNumberConcept";
import { UnexpectedDatabaseErrorException } from "../../../../shared/domain/model/DomainException";

export class NumberConceptSqlExecutor {
    public static async insert(
        tx: PrismaTransaction,
        dbNumberConcept: DbNumberConcept,
    ): Promise<void> {
        try {
            await tx.number_concept.create({ data: dbNumberConcept });
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }

    public static async insertInBulk(
        tx: PrismaTransaction,
        dbNumberConcepts: DbNumberConcept[],
    ): Promise<void> {
        try {
            await tx.number_concept.createMany({ data: dbNumberConcepts });
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }

    public static async select(
        tx: PrismaTransaction,
        searchCriteria: NumberConceptSearchCriteria,
    ): Promise<DbNumberConcept[]> {
        try {
            const dbFilterWhere =
                undefined == searchCriteria.filters
                    ? undefined
                    : DbNumberConcept.toDbFilterWhere(searchCriteria.filters);
            const dbOrderBy =
                undefined == searchCriteria.orderBy
                    ? undefined
                    : DbNumberConcept.toDbOrderBy(searchCriteria.orderBy);

            const results = await tx.number_concept.findMany({
                where: dbFilterWhere,
                skip: searchCriteria.pagination?.itemsToSkip,
                take: searchCriteria.pagination?.itemsPerPage,
                orderBy: dbOrderBy,
            });

            const dbNumberConcepts = results.map((r) => new DbNumberConcept(r));
            return dbNumberConcepts;
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }

    public static async selectExists(
        tx: PrismaTransaction,
        filters: NumberConceptFilter[],
    ): Promise<boolean> {
        try {
            const dbFilterWhere = DbNumberConcept.toDbFilterWhere(filters);

            const result = await tx.number_concept.findFirst({
                where: dbFilterWhere,
            });
            return null != result;
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }
}
