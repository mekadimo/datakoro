import type { PaginationCriteria } from "./PaginationCriteria";

export interface SearchCriteria<F, O> {
    readonly filters?: F[];
    readonly orderBy?: O[];
    readonly pagination?: PaginationCriteria;
}
