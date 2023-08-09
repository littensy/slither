import { SoundService } from "@rbxts/services";

type SoundProperties = {
	[K in WritablePropertyNames<Sound>]?: Sound[K];
};

export * from "./sounds";
export * from "./sound-groups";

export function createSound(soundId: string, soundGroup?: SoundGroup, properties?: SoundProperties) {
	const sound = new Instance("Sound");

	sound.SoundId = soundId;
	sound.SoundGroup = soundGroup;
	sound.Parent = SoundService;

	if (properties) {
		for (const [key, value] of pairs(properties)) {
			sound[key] = value as never;
		}
	}

	return sound;
}

export function playSound(soundId: string, soundGroup?: SoundGroup, properties?: SoundProperties) {
	const sound = createSound(soundId, soundGroup, properties);
	sound.Ended.Connect(() => sound.Destroy());
	sound.Play();
	return sound;
}
