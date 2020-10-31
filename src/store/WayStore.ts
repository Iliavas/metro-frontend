import { makeAutoObservable, toJS } from 'mobx';
import { string } from 'yargs';
import { ILine, IStation, Transfer, TransfersRel } from '../intefaces/IStation';

import stationsJson from '../result.json';

interface IPrevColor {
	stId: string;
	color: string;
}

class MyTransfer implements Transfer {
	public from!: string;
	public to!: string;
	public station_name_from!: string;
	public station_name_to!: string;
	public time!: number;

	constructor(from: string, to: string, station_name_from: string, station_name_to: string, time: number) {
		this.from = from;
		this.to = to;
		this.station_name_from = station_name_from;
		this.station_name_to = station_name_to;
		this.time = time;
	}
}

class MyStation implements IStation {
		public id!: number;
    public info!: any;
    public stationNumber!: number;
    public dataSetId!: string;
    public transfers!: Transfer[];
    public stationName!: string;
    public stationType!: string;
    public line!: ILine;
    public transfersRel!: TransfersRel[];
}

export default class WayStore {
	constructor() {
		makeAutoObservable(this);
	}

	private stations: IStation[] = stationsJson;

	from: IStation | undefined;
	to: IStation | undefined;
	way: IStation[] = [];

	addStation(x: IStation) {
		if (this.from) {
			if (this.to) {
				this.removeStyles(this.to.dataSetId);
			}
			this.to = x;
			this.addStyles(this.to.dataSetId);
		} else {
			this.from = x;
			this.addStyles(this.from.dataSetId);
		}

		this.calculateWay();
	}

	setFrom(x: IStation) {
		this.from = x;
		this.calculateWay();
	}

	setTo(x: IStation) {
		this.to = x;
		this.calculateWay();
	}

	private removeStyles(id: string) {
		if (id) {
			document.querySelector<HTMLDivElement>(`#station-${id}`)!.classList.remove('inWay');
		}
	}

	private addStyles(id: string) {
		if (id) {
			document.querySelector<HTMLDivElement>(`#station-${id}`)!.classList.add('inWay');
		}
	}

	isVerticesConf: boolean = false;

	ListOfVertices = new Map<string, IStation>();

	private configureVertices() {
		this.isVerticesConf = true;
		let dataToSort: IStation[][] = [];
		for (let i: number = 0; i <= 19; ++i) {
			dataToSort.push([]);
		}
		this.stations.forEach((e) => {
			dataToSort[e.line.id].push(e);
		})
		dataToSort.map((e) => {
			e.sort((e1, e2) => { return e1.stationNumber > e2.stationNumber ? 1 : -1; });
		})
		for (let i = 2; i < dataToSort.length; ++i) {
			dataToSort[i][0].transfers.push(new MyTransfer(dataToSort[i][0].dataSetId,
				dataToSort[i][1].dataSetId, dataToSort[i][0].stationName,
				dataToSort[i][1].stationName, 0));

			this.ListOfVertices.set(dataToSort[i][0].dataSetId, dataToSort[i][0]);

			for (let j = 1; j < dataToSort[i].length - 1; ++j) {

				dataToSort[i][j].transfers.push(new MyTransfer(dataToSort[i][j].dataSetId,
					dataToSort[i][j + 1].dataSetId, dataToSort[i][j].stationName,
					dataToSort[i][j + 1].stationName, 0));


				dataToSort[i][j].transfers.push(new MyTransfer(dataToSort[i][j].dataSetId,
					dataToSort[i][j - 1].dataSetId, dataToSort[i][j].stationName,
					dataToSort[i][j - 1].stationName, 0));
				this.ListOfVertices.set(dataToSort[i][j].dataSetId, dataToSort[i][j]);
			}
			let last: number = dataToSort[i].length - 1;
			dataToSort[i][last].transfers.push(new MyTransfer(dataToSort[i][last].dataSetId,
				dataToSort[i][last - 1].dataSetId, dataToSort[i][last].stationName,
				dataToSort[i][last - 1].stationName, 0));
			this.ListOfVertices.set(dataToSort[i][last].dataSetId, dataToSort[i][last]);
		}
	}



	private calculateWay() {
		if (this.from && this.to) {
			this.hide();
			if (!this.isVerticesConf) this.configureVertices();

			this.way = [];
			this.way = [this.to];

			let used = new Map<string, string>();
			used.set(this.from.dataSetId, this.from.dataSetId);
			let queue: string[] = [this.from.dataSetId];
			while (queue.length > 0) {
				let v = queue[0];
				console.log(queue);
				queue.shift();
				if (v == this.to.dataSetId) break;
				let len = this.ListOfVertices.get(v) == undefined ? 0: this.ListOfVertices.get(v)!.transfers.length;
				for (let i = 0; i < len; ++i){
					let id = this.ListOfVertices.get(v)!.transfers[i].to;
					if (!used.has(id)){ used.set(id, v); queue.push(id);}
				}
			}
			while (this.way[this.way.length-1].dataSetId != this.from.dataSetId) {
				if (this.way[this.way.length-1].dataSetId == undefined) {this.way = [this.from, this.to]; break;}
				let node = used.get(this.way[this.way.length-1].dataSetId) || '';
				let toAdd = this.ListOfVertices.get(node) || new MyStation();
				this.way.push(toAdd);
			} 
			console.log(this.way.length, toJS(this.from), toJS(this.to));

			this.highlight();
		}
	}

	private hide() {
		this.way.forEach((w) => {
			this.removeStyles(w.dataSetId);
		});
	}

	private highlight() {
		this.way.forEach((w) => {
			this.addStyles(w.dataSetId);
		});
	}

	private findTransfer(lineFrom: ILine, lineTo: ILine): IStation {
		let transfer: IStation;

		transfer = this.stations.find((s) => s.dataSetId === '1795d0dc-543e-4e47-9fee-78f86ce713d8') as IStation;

		const lineStations = this.stations.filter((s) => s.line.id === lineFrom.id);

		for (const station of lineStations) {
			const t = station.transfersRel.find((t) => t.line.id === lineTo.id);

			if (t) {
				transfer = this.stations.find((s) => s.id === t.id) as IStation;
				break;
			}
		}

		return transfer;
	}
}
