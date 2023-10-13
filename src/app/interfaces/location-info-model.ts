export interface ILocationInfo {
    country: string | null;
    state: string | null;
    city: string | null;
}

export class LocationInfo implements ILocationInfo {
    constructor(public country: string | null, public state: string | null, public city: string | null) {}
}