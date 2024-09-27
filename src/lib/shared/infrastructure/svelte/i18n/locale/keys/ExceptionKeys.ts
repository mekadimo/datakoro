import type { DomainExceptionCode } from "$lib/shared/domain/model/DomainException";

export type ExceptionKeys = {
    [key in DomainExceptionCode]: string;
};
