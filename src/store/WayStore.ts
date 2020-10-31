import { makeAutoObservable, toJS } from 'mobx';
import { ILine, IStation } from '../intefaces/IStation';

import stationsJson from '../result.json';

interface IPrevColor {
	stId: string;
	color: string;
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


	private calculateWay() {
		if (this.from && this.to) {
            this.hide();

            //code here

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
