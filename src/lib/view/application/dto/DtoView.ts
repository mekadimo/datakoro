import type { DtoConceptName } from "$lib/graph/application/dto/DtoConceptName";

export interface DtoView {
    readonly abstractionId: string | null;
    readonly conceptId: string;
    readonly names: { [conceptId: string]: DtoConceptName };
    readonly parameters: { [key: string]: string };
}

export interface DtoAbstractionView extends DtoView {
    readonly abstractionId: string;
}

export interface DtoConceptView extends DtoView {
    readonly abstractionId: null;
}
