export interface DtoGetViewInput {
    readonly conceptId: string;
    readonly abstractionId: string | null;
    readonly parameters: { [key: string]: string };
}
