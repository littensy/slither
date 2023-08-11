import { SharedState } from "shared/store";
import { CandyState } from "shared/store/candy";
import { SnakesState } from "shared/store/snakes";

import { CandyStateSerialized, deserializeCandy, serializeCandy } from "./handlers/serdes-candy";
import { deserializeSnakes, serializeSnakes, SnakesStateSerialized } from "./handlers/serdes-snake";

export interface SharedStateSerialized extends Omit<SharedState, "candy" | "snakes"> {
	candy?: CandyStateSerialized;
	snakes?: SnakesStateSerialized;
}

interface SharedStateForHydrate extends Omit<SharedState, "candy" | "snakes"> {
	candy?: CandyState;
	snakes?: SnakesState;
}

// Store the last serialized state to avoid unnecessary re-computations
let lastSerialized: SharedStateSerialized | undefined;
let lastState: SharedStateForHydrate | undefined;

export function serializeState(state: SharedStateForHydrate): SharedStateSerialized {
	if (state === lastState) {
		return lastSerialized!;
	}

	lastState = state;
	lastSerialized = {
		...state,
		candy: state.candy && serializeCandy(state.candy),
		snakes: state.snakes && serializeSnakes(state.snakes),
	};

	return lastSerialized;
}

export function deserializeState(state: SharedStateSerialized): SharedStateForHydrate {
	return {
		...state,
		candy: state.candy && deserializeCandy(state.candy),
		snakes: state.snakes && deserializeSnakes(state.snakes),
	};
}
