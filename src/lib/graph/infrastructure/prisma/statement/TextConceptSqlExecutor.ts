import type { TextConceptFilter } from "../../../domain/model/TextConcept";
import type { TextConceptSearchCriteria } from "../../../domain/model/TextConcept";
import type { PrismaTransaction } from "../../../../shared/infrastructure/prisma/model/Prisma";
import { DbTextConcept } from "../model/DbTextConcept";
import { UnexpectedDatabaseErrorException } from "../../../../shared/domain/model/DomainException";

export class TextConceptSqlExecutor {
    public static async insert(
        tx: PrismaTransaction,
        dbTextConcept: DbTextConcept,
    ): Promise<void> {
        try {
            await tx.text_concept.create({ data: dbTextConcept });
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }

    public static async insertInBulk(
        tx: PrismaTransaction,
        dbTextConcepts: DbTextConcept[],
    ): Promise<void> {
        try {
            await tx.text_concept.createMany({ data: dbTextConcepts });
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }

    public static async select(
        tx: PrismaTransaction,
        searchCriteria: TextConceptSearchCriteria,
    ): Promise<DbTextConcept[]> {
        try {
            const dbFilterWhere =
                undefined == searchCriteria.filters
                    ? undefined
                    : DbTextConcept.toDbFilterWhere(searchCriteria.filters);
            const dbOrderBy =
                undefined == searchCriteria.orderBy
                    ? undefined
                    : DbTextConcept.toDbOrderBy(searchCriteria.orderBy);

            const results = await tx.text_concept.findMany({
                where: dbFilterWhere,
                skip: searchCriteria.pagination?.itemsToSkip,
                take: searchCriteria.pagination?.itemsPerPage,
                orderBy: dbOrderBy,
            });

            const dbTextConcepts = results.map((r) => new DbTextConcept(r));
            return dbTextConcepts;
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }

    public static async selectExists(
        tx: PrismaTransaction,
        filters: TextConceptFilter[],
    ): Promise<boolean> {
        try {
            const dbFilterWhere = DbTextConcept.toDbFilterWhere(filters);

            const result = await tx.text_concept.findFirst({
                where: dbFilterWhere,
            });
            return null != result;
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }
}
