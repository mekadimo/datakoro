export interface FieldOrder<F> {
    direction: FieldOrderDirection;
    field: F;
}

export enum FieldOrderDirection {
    Asc = "FieldOrderDirection.Asc",
    Desc = "FieldOrderDirection.Desc",
}
