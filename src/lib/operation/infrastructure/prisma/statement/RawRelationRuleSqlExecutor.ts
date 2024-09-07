import type { RawRelationRuleFilter } from "../../../domain/model/RelationRule";
import type { RawRelationRuleSearchCriteria } from "../../../domain/model/RelationRule";
import type { PrismaTransaction } from "../../../../shared/infrastructure/prisma/model/Prisma";
import { DbRawRelationRule } from "../model/DbRawRelationRule";
import { UnexpectedDatabaseErrorException } from "../../../../shared/domain/model/DomainException";

export class RawRelationRuleSqlExecutor {
    public static async insert(
        tx: PrismaTransaction,
        dbRawRelationRule: DbRawRelationRule,
    ): Promise<void> {
        try {
            await tx.relation_rule.create({ data: dbRawRelationRule });
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }

    public static async insertInBulk(
        tx: PrismaTransaction,
        dbRawRelationRules: DbRawRelationRule[],
    ): Promise<void> {
        try {
            await tx.relation_rule.createMany({ data: dbRawRelationRules });
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }

    public static async select(
        tx: PrismaTransaction,
        searchCriteria: RawRelationRuleSearchCriteria,
    ): Promise<DbRawRelationRule[]> {
        try {
            const dbFilterWhere =
                undefined == searchCriteria.filters
                    ? undefined
                    : DbRawRelationRule.toDbFilterWhere(searchCriteria.filters);
            const dbOrderBy =
                undefined == searchCriteria.orderBy
                    ? undefined
                    : DbRawRelationRule.toDbOrderBy(searchCriteria.orderBy);

            const results = await tx.relation_rule.findMany({
                where: dbFilterWhere,
                skip: searchCriteria.pagination?.itemsToSkip,
                take: searchCriteria.pagination?.itemsPerPage,
                orderBy: dbOrderBy,
            });

            const dbRawRelationRules = results.map(
                (r) => new DbRawRelationRule(r),
            );
            return dbRawRelationRules;
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }

    public static async selectExists(
        tx: PrismaTransaction,
        filters: RawRelationRuleFilter[],
    ): Promise<boolean> {
        try {
            const dbFilterWhere = DbRawRelationRule.toDbFilterWhere(filters);

            const result = await tx.relation_rule.findFirst({
                where: dbFilterWhere,
            });
            return null != result;
        } catch (e) {
            console.error(e);
            throw new UnexpectedDatabaseErrorException();
        }
    }
}
