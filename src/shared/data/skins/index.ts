import { baseSnakeSkins, snakeSkins } from "./skins";
import { SnakeSkin } from "./types";

export * from "./skins";
export * from "./types";

const snakeSkinsById = new Map(snakeSkins.map((skin) => [skin.id, skin]));

/**
 * Returns the snake skin with the given id, or a default skin
 * if the id is invalid.
 */
export function getSnakeSkin(id: string): SnakeSkin {
	return snakeSkinsById.get(id) || baseSnakeSkins[0];
}

/**
 * Returns the snake skin with the given id, or undefined.
 */
export function findSnakeSkin(id: string): SnakeSkin | undefined {
	return snakeSkinsById.get(id);
}

/**
 * Returns the texture and tint of a snake tracer at this index.
 * Used to apply repeating patterns to the snake.
 */
export function getSnakeSkinForTracer(id: string, index: number): { readonly texture: string; readonly tint: Color3 } {
	const { texture, tint } = getSnakeSkin(id);

	return {
		texture: texture[index % texture.size()],
		tint: tint[index % tint.size()],
	};
}

/**
 * Returns a random default snake skin.
 */
export function getRandomBaseSnakeSkin(): SnakeSkin {
	return baseSnakeSkins[math.random(0, baseSnakeSkins.size() - 1)];
}
