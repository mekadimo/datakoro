import type { PrismaTransaction } from "../../../../shared/infrastructure/prisma/model/Prisma";
import type { ServerUserConceptFilter } from "../../../domain/model/ServerUserConcept";
import type { ServerUserConceptSearchCriteria } from "../../../domain/model/ServerUserConcept";
import { DbUserConcept } from "../model/DbUserConcept";
import { UnexpectedDatabaseErrorException } from "../../../../shared/domain/model/DomainException";

export class UserConceptSqlExecutor {
    public static async insert(
        tx: PrismaTransaction,
        dbUserConcept: DbUserConcept,
    ): Promise<void> {
        try {
            await tx.user_concept.create({ data: dbUserConcept });
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }

    public static async insertInBulk(
        tx: PrismaTransaction,
        dbUserConcepts: DbUserConcept[],
    ): Promise<void> {
        try {
            await tx.user_concept.createMany({ data: dbUserConcepts });
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }

    public static async select(
        tx: PrismaTransaction,
        searchCriteria: ServerUserConceptSearchCriteria,
    ): Promise<DbUserConcept[]> {
        try {
            const dbFilterWhere =
                undefined == searchCriteria.filters
                    ? undefined
                    : DbUserConcept.toDbServerFilterWhere(
                          searchCriteria.filters,
                      );
            const dbOrderBy =
                undefined == searchCriteria.orderBy
                    ? undefined
                    : DbUserConcept.toDbServerOrderBy(searchCriteria.orderBy);

            const results = await tx.user_concept.findMany({
                where: dbFilterWhere,
                skip: searchCriteria.pagination?.itemsToSkip,
                take: searchCriteria.pagination?.itemsPerPage,
                orderBy: dbOrderBy,
            });

            const dbUserConcepts = results.map((r) => new DbUserConcept(r));
            return dbUserConcepts;
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }

    public static async update(
        tx: PrismaTransaction,
        dbUserConcept: DbUserConcept,
    ): Promise<void> {
        try {
            await tx.user_concept.update({
                where: { concept_id: dbUserConcept.concept_id },
                data: dbUserConcept,
            });
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }

    public static async selectExists(
        tx: PrismaTransaction,
        filters: ServerUserConceptFilter[],
    ): Promise<boolean> {
        try {
            const dbFilterWhere = DbUserConcept.toDbServerFilterWhere(filters);

            const result = await tx.user_concept.findFirst({
                where: dbFilterWhere,
            });
            return null != result;
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }
}
