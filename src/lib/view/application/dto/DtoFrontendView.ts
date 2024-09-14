export interface DtoGetViewInput {
    readonly abstractionId: string | null;
    readonly conceptId: string;
    readonly parameters: { [key: string]: string };
    readonly preferredLanguageCode: string;
}
