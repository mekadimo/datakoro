export interface FieldOrder<F> {
    readonly direction: FieldOrderDirection;
    readonly field: F;
}

export enum FieldOrderDirection {
    Asc = "FieldOrderDirection.Asc",
    Desc = "FieldOrderDirection.Desc",
}
