import { Prisma } from "@prisma/client";

import { PRISMA_CLIENT } from "$lib/shared/infrastructure/prisma/model/Prisma";
import { TextConceptSqlExecutor } from "$lib/graph/infrastructure/prisma/statement/TextConceptSqlExecutor";

export async function load(): Promise<{
    testResults: {
        concept_id: string;
        text_value: string;
        transaction_date: Date;
    }[];
}> {
    const testResults = await PRISMA_CLIENT.$transaction(
        async (prismaTransaction) => {
            const results = await TextConceptSqlExecutor.select(
                prismaTransaction,
                {},
            );
            return results.map((c) => {
                return {
                    concept_id: c.concept_id,
                    text_value: c.text_value,
                    transaction_date: c.transaction_date,
                };
            });
        },
        {
            maxWait: 5000, // default: 2000
            timeout: 10000, // default: 5000
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // optional, default defined by database configuration
        },
    );

    return {
        testResults,
    };
}
