import { Players } from "@rbxts/services";
import { promiseTree } from "@rbxts/validate-tree";

const characterTree = {
	$className: "Model",
	HumanoidRootPart: {
		$className: "BasePart",
	},
	Humanoid: {
		$className: "Humanoid",
		Animator: {
			$className: "Animator",
		},
	},
} as const;

export interface Character extends Model {
	HumanoidRootPart: BasePart;
	Humanoid: Humanoid & {
		Animator: Animator;
	};
}

export async function promiseCharacter(character: Model): Promise<Character> {
	return promiseTree(character, characterTree).timeout(30, "Character timed out");
}

export async function promisePlayerDisconnected(player: Player): Promise<void> {
	if (!player.IsDescendantOf(Players)) {
		return;
	}

	await Promise.fromEvent(Players.PlayerRemoving, (playerWhoLeft) => playerWhoLeft === player);
}
