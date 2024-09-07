import type { TransactionConceptFilter } from "../../../domain/model/TransactionConcept";
import type { TransactionConceptSearchCriteria } from "../../../domain/model/TransactionConcept";
import type { PrismaTransaction } from "../../../../shared/infrastructure/prisma/model/Prisma";
import { DbTransactionConcept } from "../model/DbTransactionConcept";
import { UnexpectedDatabaseErrorException } from "../../../../shared/domain/model/DomainException";

export class TransactionConceptSqlExecutor {
    public static async insert(
        tx: PrismaTransaction,
        dbTransactionConcept: DbTransactionConcept,
    ): Promise<void> {
        try {
            await tx.transaction_concept.create({ data: dbTransactionConcept });
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }

    public static async insertInBulk(
        tx: PrismaTransaction,
        dbTransactionConcepts: DbTransactionConcept[],
    ): Promise<void> {
        try {
            await tx.transaction_concept.createMany({
                data: dbTransactionConcepts,
            });
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }

    public static async select(
        tx: PrismaTransaction,
        searchCriteria: TransactionConceptSearchCriteria,
    ): Promise<DbTransactionConcept[]> {
        try {
            const dbFilterWhere =
                undefined == searchCriteria.filters
                    ? undefined
                    : DbTransactionConcept.toDbFilterWhere(
                          searchCriteria.filters,
                      );
            const dbOrderBy =
                undefined == searchCriteria.orderBy
                    ? undefined
                    : DbTransactionConcept.toDbOrderBy(searchCriteria.orderBy);

            const results = await tx.transaction_concept.findMany({
                where: dbFilterWhere,
                skip: searchCriteria.pagination?.itemsToSkip,
                take: searchCriteria.pagination?.itemsPerPage,
                orderBy: dbOrderBy,
            });

            const dbTransactionConcepts = results.map(
                (r) => new DbTransactionConcept(r),
            );
            return dbTransactionConcepts;
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }

    public static async selectExists(
        tx: PrismaTransaction,
        filters: TransactionConceptFilter[],
    ): Promise<boolean> {
        try {
            const dbFilterWhere = DbTransactionConcept.toDbFilterWhere(filters);

            const result = await tx.transaction_concept.findFirst({
                where: dbFilterWhere,
            });
            return null != result;
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }
}
