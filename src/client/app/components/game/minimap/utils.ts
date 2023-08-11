import { map } from "@rbxts/pretty-react-hooks";
import { useRem } from "client/app/hooks";
import { WORLD_BOUNDS } from "shared/constants";

export const MINIMUM_MINIMAP_REM = 10;

export function useMinimapRem() {
	return useRem({ minimum: MINIMUM_MINIMAP_REM });
}

export function normalizeToWorldBounds(vector: Vector2) {
	return new Vector2(
		map(vector.X, -WORLD_BOUNDS, WORLD_BOUNDS, 0, 1),
		map(vector.Y, -WORLD_BOUNDS, WORLD_BOUNDS, 0, 1),
	);
}
