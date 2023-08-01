import Object from "@rbxts/object-utils";
import { images } from "shared/assets";
import { accents } from "shared/data/palette";

export interface SnakeSkin {
	readonly id: string;
	readonly size: Vector2;
	readonly tint: readonly Color3[];
	readonly texture: readonly string[];
	readonly primary?: Color3;
	readonly secondary?: Color3;
}

export const defaultSnakeSkins: readonly SnakeSkin[] = Object.entries(accents).map(([id, tint]) => {
	return {
		id,
		size: new Vector2(512, 512),
		tint: [tint],
		texture: [images.skins.snake_main],
	};
});

export const snakeSkins: readonly SnakeSkin[] = [
	// default palette
	...defaultSnakeSkins,
];

const snakeSkinMap = new Map(snakeSkins.map((skin) => [skin.id, skin]));

/**
 * Returns the snake skin with the given id, or a default skin
 * if the id is invalid.
 */
export function getSnakeSkin(id: string): SnakeSkin {
	return snakeSkinMap.get(id) || defaultSnakeSkins[0];
}

/**
 * Returns the texture and tint of a snake tracer at this index.
 * Used to apply repeating patterns to the snake.
 */
export function getSnakeTracerSkin(id: string, index: number): { readonly texture: string; readonly tint: Color3 } {
	const { texture, tint } = getSnakeSkin(id);

	return {
		texture: texture[index % texture.size()],
		tint: tint[index % tint.size()],
	};
}

/**
 * Returns a random default snake skin.
 */
export function getRandomDefaultSnakeSkin(): SnakeSkin {
	return defaultSnakeSkins[math.random(0, defaultSnakeSkins.size() - 1)];
}
