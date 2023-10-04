import { ProducerMiddleware } from "@rbxts/reflex";
import { IS_PROD } from "shared/constants/core";

export const profilerMiddleware: ProducerMiddleware = () => {
	return (dispatch, name) => {
		if (IS_PROD) {
			return dispatch;
		}

		return (...args) => {
			debug.profilebegin(name);
			const result = dispatch(...args);
			debug.profileend();
			return result;
		};
	};
};
