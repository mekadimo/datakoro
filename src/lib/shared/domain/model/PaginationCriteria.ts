import { InvalidPaginationItemsPerPageException } from "./DomainException";
import { InvalidPaginationPageNumberException } from "./DomainException";

const MIN_ITEMS_PER_PAGE = 1;
const MIN_PAGE_NUMBER = 1;

export class PaginationCriteria {
    // TODO: Use value objects?
    public readonly itemsPerPage: number;
    public readonly pageNumber: number;

    constructor(input: { itemsPerPage: number; pageNumber: number }) {
        this.itemsPerPage = input.itemsPerPage;
        this.pageNumber = input.pageNumber;
        this.assertIsValid();
    }

    public get itemsToSkip(): number {
        return this.itemsPerPage * (this.pageNumber - 1);
    }

    private assertIsValid(): void {
        if (
            !Number.isInteger(this.itemsPerPage) ||
            this.itemsPerPage < MIN_ITEMS_PER_PAGE
        ) {
            throw new InvalidPaginationItemsPerPageException({
                value: this.itemsPerPage,
            });
        }
        if (
            !Number.isInteger(this.pageNumber) ||
            this.pageNumber < MIN_PAGE_NUMBER
        ) {
            throw new InvalidPaginationPageNumberException({
                value: this.pageNumber,
            });
        }
    }
}
