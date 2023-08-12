import { createProducer } from "@rbxts/reflex";

export interface AlertState {
	readonly alerts: readonly Alert[];
}

export interface Alert {
	readonly id: number;
	readonly emoji: string;
	readonly message: string;
	readonly color: Color3;
	readonly duration: number;
	readonly visible: boolean;
}

const initialState: AlertState = {
	alerts: [],
};

export const alertSlice = createProducer(initialState, {
	addAlert: (state, alert: Alert) => ({
		...state,
		alerts: [alert, ...state.alerts],
	}),

	removeAlert: (state, id: number) => ({
		...state,
		alerts: state.alerts.filter((alert) => alert.id !== id),
	}),

	setAlertVisible: (state, id: number, visible: boolean) => ({
		...state,
		alerts: state.alerts.map((alert) => (alert.id === id ? { ...alert, visible } : alert)),
	}),
});
