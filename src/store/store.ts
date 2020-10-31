import { createContext, useContext } from 'react';
import WayStore from './WayStore';

export interface IStore {
	wayStore: WayStore;
}

export const store: IStore = {
	wayStore: new WayStore(),
};

export const StoreContext = createContext(store);

export const useStore = () => {
	return useContext(StoreContext);
};
