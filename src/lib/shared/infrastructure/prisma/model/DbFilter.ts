import type { Decimal } from "decimal.js/decimal";

export interface DbBooleanFilter {
    equals: boolean;
}

export interface DbDateTimeFilter {
    equals?: Date;
    gt?: Date;
    gte?: Date;
    lt?: Date;
    lte?: Date;
    not?: Date;
}

export interface DbDecimalNumberFilter {
    equals?: Decimal;
    gt?: Decimal;
    gte?: Decimal;
    lt?: Decimal;
    lte?: Decimal;
    not?: Decimal;
}

export interface DbIntegerNumberFilter {
    equals?: bigint;
    gt?: bigint;
    gte?: bigint;
    lt?: bigint;
    lte?: bigint;
    not?: bigint;
}

export interface DbNullableDateTimeFilter {
    equals?: Date | null;
    gt?: Date;
    gte?: Date;
    lt?: Date;
    lte?: Date;
    not?: Date | null;
}

export interface DbNullableIntegerNumberFilter {
    equals?: bigint | null;
    gt?: bigint;
    gte?: bigint;
    lt?: bigint;
    lte?: bigint;
    not?: bigint | null;
}

export interface DbTextFilter {
    contains?: string;
    endsWith?: string;
    equals?: string;
    in?: string[];
    mode: "insensitive" | "default";
    not?: string;
    // TODO: Not supported by Prisma
    // notContains?: string;
    // notEndsWith?: string;
    // notStartsWith?: string;
    notIn?: string[];
    startsWith?: string;
}

export interface DbUuidFilter {
    equals?: string;
    in?: string[];
    not?: string;
    notIn?: string[];
}
