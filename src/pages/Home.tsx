import { IonPage } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import './Home.scss';

import { ReactComponent as TubeMap } from './imgs/map.svg';

import stationsJson from '../result.json';
import { IStation } from '../intefaces/IStation';
import { useStore } from '../store/store';
import { observer } from 'mobx-react-lite';

interface IprevColors {
	stId: string;
	color: string;
}

const Home: React.FC = observer(() => {
	const { wayStore } = useStore();

	function stationOnClick(e: MouseEvent, station: IStation) {
		wayStore.addStation(station);
	}

	useEffect(() => {
		stationsJson.forEach((station: IStation) => {
			document
				.querySelector<HTMLElement>(`#station-${station.dataSetId}`)
				?.addEventListener('click', (e) => stationOnClick(e, station));
			// console.log(`path#station-${station.dataSetId}`);
		});
	}, []);

	return (
		<div className="page">
			<TransformWrapper
				options={{
					limitToBounds: false,
					minScale: 0.2,
				}}
				doubleClick={{
					disabled: true,
				}}
				defaultPositionX={-50}
				defaultPositionY={150}
				defaultScale={0.2}
				wheel={{
					step: 125,
				}}
			>
				<TransformComponent>
					<TubeMap />
				</TransformComponent>
			</TransformWrapper>
		</div>
	);
});

export default Home;
