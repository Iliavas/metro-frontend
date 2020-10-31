export interface Transfer {
    from: string;
    station_name_from: string;
    to: string;
    station_name_to: string;
    time: number;
}

export interface ILine {
    id: number;
    lineName: string;
    info?: any;
}

export interface Transfer2 {
    from: string;
    station_name_from: string;
    to: string;
    station_name_to: string;
    time: number;
}

export interface Line2 {
    id: number;
    lineName: string;
    info?: any;
}

export interface TransfersRel {
    id: number;
    info?: any;
    stationNumber: number;
    dataSetId: string;
    transfers: Transfer2[];
    stationName: string;
    stationType: string;
    line: Line2;
}

export interface IStation {
    id: number;
    info?: any;
    stationNumber: number;
    dataSetId: string;
    transfers: Transfer[];
    stationName: string;
    stationType: string;
    line: ILine;
    transfersRel: TransfersRel[];
}