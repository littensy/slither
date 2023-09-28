import { SharedState } from "shared/store";
import { CandyState } from "shared/store/candy";
import { SnakesState } from "shared/store/snakes";

import { deserializeCandy, serializeCandy } from "./handlers/serdes-candy";
import { deserializeSnakes, serializeSnakes } from "./handlers/serdes-snake";

export interface SharedStateSerialized extends Omit<SharedState, "candy" | "snakes"> {
	candy?: string;
	snakes?: string;
}

interface SharedStateForSerdes extends Omit<SharedState, "candy" | "snakes"> {
	candy?: CandyState;
	snakes?: SnakesState;
}

// Store the last serialized state to avoid unnecessary re-computations
let lastSerialized: SharedStateSerialized | undefined;
let lastCandy: CandyState | undefined;
let lastSnakes: SnakesState | undefined;

export function serializeState(state: SharedStateForSerdes, includeCandy = true): SharedStateSerialized {
	if (state.candy === lastCandy && state.snakes === lastSnakes) {
		return lastSerialized!;
	}

	const serialized = {
		...state,
		candy: state.candy && includeCandy ? serializeCandy(state.candy) : undefined,
		snakes: state.snakes && serializeSnakes(state.snakes),
	};

	lastSerialized = serialized;
	lastCandy = state.candy;
	lastSnakes = state.snakes;

	return serialized;
}

export function deserializeState(state: SharedStateSerialized): SharedStateForSerdes {
	return {
		...state,
		candy: state.candy !== undefined ? deserializeCandy(state.candy) : undefined,
		snakes: state.snakes !== undefined ? deserializeSnakes(state.snakes) : undefined,
	};
}
