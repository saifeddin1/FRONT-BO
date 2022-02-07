export interface PaginatedResult {
    totalCount: {
        count: number
    };
    totalData: any;
}
export class PaginationArgs {
    page: number; limit: number; text: string; startDate: Date; endDate: Date;
    constructor(page?, limit?, text?, startDate?, endDate?) {
        if (page) this.page = page; else this.page = 0;
        if (limit) this.limit = limit; else this.limit = 10;
        if (text) this.text = text; else this.text = null;
        if (startDate) this.startDate = startDate; else this.startDate = null;
        if (endDate) this.endDate = endDate; else this.endDate = null;
    }

    getQueryUrl() {
        return Object.keys(this)
            .filter(key => this[key]
                && this[key] != ""
                && this[key] != undefined
                && this[key] != "undefined"
                && this[key] != null
                && this[key] != "null")
            .map(key => `${key}=${this[key]}`)
            .join('&');
    }
}