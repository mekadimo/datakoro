// import type { MagnitudeConceptSearchCriteria } from "../../../domain/model/MagnitudeConcept";
import { insertMagnitudeConcept } from "@prisma/client/sql";
import type { PrismaTransaction } from "../../../../shared/infrastructure/prisma/model/Prisma";
import { DbMagnitudeConcept } from "../model/DbMagnitudeConcept";
import { UnexpectedDatabaseErrorException } from "../../../../shared/domain/model/DomainException";

export class MagnitudeConceptSqlExecutor {
    public static async insert(
        tx: PrismaTransaction,
        dbMagnitudeConcept: DbMagnitudeConcept,
    ): Promise<void> {
        try {
            // TODO: Simplify this mess when Prisma's TypedSql supports nullable
            await tx.$queryRawTyped(
                insertMagnitudeConcept(
                    dbMagnitudeConcept.concept_id,
                    dbMagnitudeConcept.concept_id_magnitude,
                    null == dbMagnitudeConcept.number_range_value[0],
                    null == dbMagnitudeConcept.number_range_value[0]
                        ? 0
                        : dbMagnitudeConcept.number_range_value[0],
                    null == dbMagnitudeConcept.number_range_value[1],
                    null == dbMagnitudeConcept.number_range_value[1]
                        ? 0
                        : dbMagnitudeConcept.number_range_value[1],
                    dbMagnitudeConcept.transaction_date,
                ),
            );
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }

    public static async insertInBulk(
        tx: PrismaTransaction,
        dbMagnitudeConcepts: DbMagnitudeConcept[],
    ): Promise<void> {
        // TODO: Implement a real insert in bulk (a single INSERT INTO for all)
        for (const dbMagnitudeConcept of dbMagnitudeConcepts) {
            await MagnitudeConceptSqlExecutor.insert(tx, dbMagnitudeConcept);
        }
    }

    // TODO: Since NUMRANGE is not officially supported by Prisma yet, we must
    //       implement it manually. However, we cannot use TypedSql due to
    //       dynamic criteria; this is a challenge that must be thought
    //       carefully...
    // public static async select(
    //     tx: PrismaTransaction,
    //     searchCriteria: MagnitudeConceptSearchCriteria,
    // ): Promise<DbMagnitudeConcept[]> {
    //     try {
    //         const dbFilterWhere =
    //             undefined == searchCriteria.filters
    //                 ? undefined
    //                 : DbMagnitudeConcept.toDbFilterWhere(
    //                       searchCriteria.filters,
    //                   );
    //         const dbOrderBy =
    //             undefined == searchCriteria.orderBy
    //                 ? undefined
    //                 : DbMagnitudeConcept.toDbOrderBy(searchCriteria.orderBy);

    //         const results = await tx.magnitude_concept.findMany({
    //             where: dbFilterWhere,
    //             skip: searchCriteria.pagination?.itemsToSkip,
    //             take: searchCriteria.pagination?.itemsPerPage,
    //             orderBy: dbOrderBy,
    //         });

    //         const dbMagnitudeConcepts = results.map(
    //             (r) => new DbMagnitudeConcept(r),
    //         );
    //         return dbMagnitudeConcepts;
    //     } catch (e) {
    //         console.error(e);
    //         throw new UnexpectedDatabaseErrorException();
    //     }
    // }
}
