import { SoundService } from "@rbxts/services";
import { IS_EDIT } from "shared/constants";

const soundGroup = (name: string): SoundGroup | undefined => {
	if (!IS_EDIT) {
		const soundGroup = new Instance("SoundGroup");
		soundGroup.Name = name;
		soundGroup.Parent = SoundService;
		return soundGroup;
	}
};

export const soundGroups = {
	music: soundGroup("music"),
	ui: soundGroup("ui"),
	sfx: soundGroup("sfx"),
};
