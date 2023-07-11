import Object from "@rbxts/object-utils";
import { images } from "shared/assets";
import { palette } from "shared/data/palette";

export interface SnakeSkin {
	readonly id: string;
	readonly tint: Color3 | readonly Color3[];
	readonly size: Vector2;
	readonly texture: string | readonly string[];
}

export const defaultSnakeSkins: readonly SnakeSkin[] = Object.entries(palette).map(([id, tint]) => {
	return { id, tint, size: new Vector2(512, 512), texture: images.skins.snake_main };
});

export const snakeSkins: readonly SnakeSkin[] = [
	// default palette
	...defaultSnakeSkins,
];

const snakeSkinMap = new Map(snakeSkins.map((skin) => [skin.id, skin]));

export function getSnakeSkin(id: string): SnakeSkin {
	return snakeSkinMap.get(id) || defaultSnakeSkins[0];
}

export function getSnakeSegmentSkin(id: string, index: number): { readonly texture: string; readonly tint: Color3 } {
	const { texture, tint } = getSnakeSkin(id);
	return {
		texture: typeIs(texture, "string") ? texture : texture[index % texture.size()],
		tint: typeIs(tint, "Color3") ? tint : tint[index % tint.size()],
	};
}

export function getRandomDefaultSnakeSkin(): SnakeSkin {
	return defaultSnakeSkins[math.random(0, defaultSnakeSkins.size() - 1)];
}
