import Make from "@rbxts/make";
import { SoundService } from "@rbxts/services";
import { SoundCategory, getSoundGroup } from "./sound-groups";

export * from "./sound-groups";

type SoundProperties = {
	[K in WritablePropertyNames<Sound>]?: Sound[K];
};

export type SoundName = keyof typeof sounds;

export const sounds = {
	placeholder: "rbxassetid://0",
} as const;

/**
 * Returns whether the given sound asset is valid.
 * @param name The sound asset to check.
 * @returns Whether the sound asset is valid.
 */
export function isSoundAsset(name: string): name is SoundName {
	return name in sounds;
}

/**
 * Creates a sound object with the given properties.
 * @param name The sound asset name.
 * @param category The sound group category.
 * @param properties Optional properties to set on the sound.
 * @returns The sound object.
 */
export function createSound(id: SoundName, category: SoundCategory, properties?: SoundProperties) {
	return Make("Sound", {
		SoundId: isSoundAsset(id) ? sounds[id] : id,
		SoundGroup: getSoundGroup(category),
		Parent: SoundService,
		...properties,
	});
}

/**
 * Plays a sound with the given properties. When the sound ends, it will be
 * destroyed. Returns the sound object.
 * @param name The sound asset name.
 * @param category The sound group category.
 * @param properties Optional properties to set on the sound.
 * @returns The sound object.
 */
export function playSound(id: SoundName, category: SoundCategory, properties?: SoundProperties) {
	const sound = createSound(id, category, properties);
	sound.Ended.Connect(() => sound.Destroy());
	sound.Play();
	return sound;
}
