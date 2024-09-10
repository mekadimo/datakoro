import type { Decimal } from "decimal.js/decimal";

export interface DbBooleanFilter {
    readonly equals: boolean;
}

export interface DbDateTimeFilter {
    readonly equals?: Date;
    readonly gt?: Date;
    readonly gte?: Date;
    readonly lt?: Date;
    readonly lte?: Date;
    readonly not?: Date;
}

export interface DbDecimalNumberFilter {
    readonly equals?: Decimal;
    readonly gt?: Decimal;
    readonly gte?: Decimal;
    readonly lt?: Decimal;
    readonly lte?: Decimal;
    readonly not?: Decimal;
}

export interface DbIntegerNumberFilter {
    readonly equals?: bigint;
    readonly gt?: bigint;
    readonly gte?: bigint;
    readonly lt?: bigint;
    readonly lte?: bigint;
    readonly not?: bigint;
}

export interface DbNullableDateTimeFilter {
    readonly equals?: Date | null;
    readonly gt?: Date;
    readonly gte?: Date;
    readonly lt?: Date;
    readonly lte?: Date;
    readonly not?: Date | null;
}

export interface DbNullableIntegerNumberFilter {
    readonly equals?: bigint | null;
    readonly gt?: bigint;
    readonly gte?: bigint;
    readonly lt?: bigint;
    readonly lte?: bigint;
    readonly not?: bigint | null;
}

export interface DbTextFilter {
    readonly contains?: string;
    readonly endsWith?: string;
    readonly equals?: string;
    readonly in?: string[];
    readonly mode: "insensitive" | "default";
    readonly not?: string;
    // TODO: Not supported by Prisma
    // readonly notContains?: string;
    // readonly notEndsWith?: string;
    // readonly notStartsWith?: string;
    readonly notIn?: string[];
    readonly startsWith?: string;
}

export interface DbUuidFilter {
    readonly equals?: string;
    readonly in?: string[];
    readonly not?: string;
    readonly notIn?: string[];
}
