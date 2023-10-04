import { images } from "shared/assets";

export interface SnakeSkin {
	readonly id: string;
	readonly price: number;
	readonly size: Vector2;
	readonly tint: readonly Color3[];
	readonly boostTint?: readonly Color3[];
	readonly texture: readonly string[];
	readonly eyeTextureLeft: string;
	readonly eyeTextureRight: string;
	readonly headTexture?: string;
	readonly headColor?: Color3;
	readonly primary?: Color3;
	readonly secondary?: Color3;
}

export const defaultSnakeSkin: SnakeSkin = {
	id: "default",
	price: 0,
	size: new Vector2(512, 512),
	tint: [Color3.fromRGB(255, 255, 255)],
	texture: [images.skins.snake_main],
	eyeTextureLeft: images.skins.snake_eye_left,
	eyeTextureRight: images.skins.snake_eye_right,
};
