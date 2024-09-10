export interface DtoView {
    readonly conceptId: string;
    readonly abstractionId: string | null;
    readonly parameters: { [key: string]: string };
}

export interface DtoAbstractionView extends DtoView {
    readonly abstractionId: string;
}

export interface DtoConceptView extends DtoView {
    readonly abstractionId: null;
}
