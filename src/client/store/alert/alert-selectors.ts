import { createSelector } from "@rbxts/reflex";

import { RootState } from "..";

export const selectAlerts = (state: RootState) => {
	return state.alert.alerts;
};

export const selectAlertsVisible = createSelector(selectAlerts, (alerts) => {
	return alerts.filter((alert) => alert.visible);
});

export const selectAlertIndex = (id: number) => {
	return createSelector(selectAlertsVisible, (alerts) => {
		return alerts.findIndex((alert) => alert.id === id);
	});
};
