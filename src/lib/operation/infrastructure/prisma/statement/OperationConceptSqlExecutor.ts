import type { OperationConceptFilter } from "../../../domain/model/OperationConcept";
import type { OperationConceptSearchCriteria } from "../../../domain/model/OperationConcept";
import type { PrismaTransaction } from "../../../../shared/infrastructure/prisma/model/Prisma";
import { DbOperationConcept } from "../model/DbOperationConcept";
import { UnexpectedDatabaseErrorException } from "../../../../shared/domain/model/DomainException";

export class OperationConceptSqlExecutor {
    public static async insert(
        tx: PrismaTransaction,
        dbOperationConcept: DbOperationConcept,
    ): Promise<void> {
        try {
            await tx.operation_concept.create({ data: dbOperationConcept });
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }

    public static async insertInBulk(
        tx: PrismaTransaction,
        dbOperationConcepts: DbOperationConcept[],
    ): Promise<void> {
        try {
            await tx.operation_concept.createMany({
                data: dbOperationConcepts,
            });
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }

    public static async select(
        tx: PrismaTransaction,
        searchCriteria: OperationConceptSearchCriteria,
    ): Promise<DbOperationConcept[]> {
        try {
            const dbFilterWhere =
                undefined == searchCriteria.filters
                    ? undefined
                    : DbOperationConcept.toDbFilterWhere(
                          searchCriteria.filters,
                      );
            const dbOrderBy =
                undefined == searchCriteria.orderBy
                    ? undefined
                    : DbOperationConcept.toDbOrderBy(searchCriteria.orderBy);

            const results = await tx.operation_concept.findMany({
                where: dbFilterWhere,
                skip: searchCriteria.pagination?.itemsToSkip,
                take: searchCriteria.pagination?.itemsPerPage,
                orderBy: dbOrderBy,
            });

            const dbOperationConcepts = results.map(
                (r) => new DbOperationConcept(r),
            );
            return dbOperationConcepts;
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }

    public static async selectExists(
        tx: PrismaTransaction,
        filters: OperationConceptFilter[],
    ): Promise<boolean> {
        try {
            const dbFilterWhere = DbOperationConcept.toDbFilterWhere(filters);

            const result = await tx.operation_concept.findFirst({
                where: dbFilterWhere,
            });
            return null != result;
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }
}
