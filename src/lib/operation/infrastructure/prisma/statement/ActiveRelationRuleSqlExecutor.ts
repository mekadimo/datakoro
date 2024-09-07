import type { ActiveRelationRuleFilter } from "../../../domain/model/RelationRule";
import type { ActiveRelationRuleSearchCriteria } from "../../../domain/model/RelationRule";
import type { PrismaTransaction } from "../../../../shared/infrastructure/prisma/model/Prisma";
import { DbActiveRelationRule } from "../model/DbActiveRelationRule";
import { UnexpectedDatabaseErrorException } from "../../../../shared/domain/model/DomainException";

export class ActiveRelationRuleSqlExecutor {
    public static async select(
        tx: PrismaTransaction,
        searchCriteria: ActiveRelationRuleSearchCriteria,
    ): Promise<DbActiveRelationRule[]> {
        try {
            const dbFilterWhere =
                undefined == searchCriteria.filters
                    ? undefined
                    : DbActiveRelationRule.toDbFilterWhere(
                          searchCriteria.filters,
                      );
            const dbOrderBy =
                undefined == searchCriteria.orderBy
                    ? undefined
                    : DbActiveRelationRule.toDbOrderBy(searchCriteria.orderBy);

            const results = await tx.active_relation_rule.findMany({
                where: dbFilterWhere,
                skip: searchCriteria.pagination?.itemsToSkip,
                take: searchCriteria.pagination?.itemsPerPage,
                orderBy: dbOrderBy,
            });

            const dbActiveRelationRules = results.map(
                (r) => new DbActiveRelationRule(r),
            );
            return dbActiveRelationRules;
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }

    public static async selectExists(
        tx: PrismaTransaction,
        filters: ActiveRelationRuleFilter[],
    ): Promise<boolean> {
        try {
            const dbFilterWhere = DbActiveRelationRule.toDbFilterWhere(filters);

            const result = await tx.active_relation_rule.findFirst({
                where: dbFilterWhere,
            });
            return null != result;
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }
}
