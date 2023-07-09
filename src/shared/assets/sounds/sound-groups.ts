import Make from "@rbxts/make";
import { SoundService } from "@rbxts/services";
import { IS_EDIT } from "shared/constants";

export type SoundCategory = "music" | "sfx" | "ui";

const soundGroups: readonly SoundCategory[] = ["music", "sfx", "ui"];
const soundGroupMap = new Map<SoundCategory, SoundGroup>();

/**
 * Returns the SoundGroup instance for the given group.
 * @param group The group to get the SoundGroup instance for.
 * @returns The SoundGroup instance.
 */
export function getSoundGroup(group: SoundCategory) {
	createSoundGroups();
	return soundGroupMap.get(group)!;
}

/**
 * Returns a map of all SoundGroup instances.
 * @returns A map of SoundGroups.
 */
export function getSoundGroups() {
	createSoundGroups();
	return soundGroupMap;
}

/**
 * Creates all SoundGroup instances if they don't already exist. This is called
 * automatically when a SoundGroup is requested.
 */
function createSoundGroups() {
	if (IS_EDIT || !soundGroupMap.isEmpty()) {
		return;
	}

	for (const group of soundGroups) {
		soundGroupMap.set(group, Make("SoundGroup", { Name: group, Parent: SoundService }));
	}
}
