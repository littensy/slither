import { RootState } from "..";

export const selectAlerts = (state: RootState) => {
	return state.alert.alerts;
};
