import { WORLD_BOUNDS } from "shared/constants";
import { snakeGrid } from "../workers/snake-worker/snake-grid";

const MIN_SAFE_DISTANCE = 10;

/**
 * Returns a random point in the world. If the margin is specified,
 * the point will be within this percentage of the world bounds.
 */
export function getRandomPointInWorld(margin = 1) {
	const random = new Random();
	let position = new Vector2();

	do {
		const x = random.NextNumber(-margin, margin);
		const y = random.NextNumber(-margin, margin);
		position = new Vector2(x, y).mul(WORLD_BOUNDS);
	} while (position.Magnitude > WORLD_BOUNDS);

	return position;
}

/**
 * Returns a random point in the world that is more likely to be
 * closer to the origin.
 */
export function getRandomPointNearWorldOrigin(margin = 1, passes = 2) {
	let currentPosition = new Vector2();
	let currentDistance = math.huge;

	for (const _ of $range(0, passes)) {
		const position = getRandomPointInWorld(margin);
		const distance = position.Magnitude;

		if (distance < currentDistance) {
			currentPosition = position;
			currentDistance = distance;
		}
	}

	return currentPosition;
}

/**
 * Returns a safe point in the world. This should be a point that is
 * not too close to any other snake, but not the farthest point either.
 */
export function getSafePointInWorld() {
	const spawns: { position: Vector2; safety: number }[] = [];

	const scoreSafety = (spawn: Vector2) => {
		const nearest = snakeGrid.nearest(spawn, MIN_SAFE_DISTANCE * 2);
		const distance = nearest ? nearest.position.sub(spawn).Magnitude : math.huge;
		return distance;
	};

	for (const _ of $range(0, 10)) {
		const position = getRandomPointNearWorldOrigin(0.8);
		const safety = scoreSafety(position);
		spawns.push({ position, safety });
	}

	const sorted = spawns.sort((a, b) => a.safety < b.safety);

	// Find the first safe spawn that is still close to another snake
	for (const spawn of sorted) {
		if (spawn.safety > MIN_SAFE_DISTANCE) {
			return spawn.position;
		}
	}

	return sorted[sorted.size() - 1].position;
}
