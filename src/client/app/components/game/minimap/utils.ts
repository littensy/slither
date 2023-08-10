import { map } from "@rbxts/pretty-react-hooks";
import { WORLD_BOUNDS } from "shared/constants";

export const MINIMUM_MINIMAP_REM = 10;

export function normalizeToWorldBounds(vector: Vector2) {
	return new Vector2(
		map(vector.X, -WORLD_BOUNDS, WORLD_BOUNDS, 0, 1),
		map(vector.Y, -WORLD_BOUNDS, WORLD_BOUNDS, 0, 1),
	);
}
