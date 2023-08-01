import { SharedState } from "../";

export const selectPlayerSaves = (state: SharedState) => {
	return state.saves;
};

export const selectPlayerSave = (id: string) => {
	return (state: SharedState) => state.saves[id];
};

export const selectPlayerBalance = (id: string) => {
	return (state: SharedState) => state.saves[id]?.balance;
};

export const selectPlayerSkins = (id: string) => {
	return (state: SharedState) => state.saves[id]?.skins;
};

export const selectCurrentPlayerSkin = (id: string) => {
	return (state: SharedState) => state.saves[id]?.skin;
};
