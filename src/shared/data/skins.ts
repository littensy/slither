import Object from "@rbxts/object-utils";
import { ImageName } from "shared/assets";
import { palette } from "shared/data/palette";

export interface SnakeSkin {
	readonly id: string;
	readonly tint: Color3;
	readonly texture: ImageName;
}

export const defaultSnakeSkins: readonly SnakeSkin[] = Object.entries(palette).map(([id, tint]) => {
	return { id, tint, texture: "snake_main" };
});

export const snakeSkins: readonly SnakeSkin[] = [
	// default palette
	...defaultSnakeSkins,
];

const snakeSkinMap = new Map(snakeSkins.map((skin) => [skin.id, skin]));

export function getSnakeSkin(id: string): SnakeSkin | undefined {
	return snakeSkinMap.get(id);
}

export function getRandomDefaultSnakeSkin(): SnakeSkin {
	return defaultSnakeSkins[math.random(0, defaultSnakeSkins.size() - 1)];
}
