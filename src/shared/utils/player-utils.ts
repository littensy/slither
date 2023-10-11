import { Players } from "@rbxts/services";
import { promiseTree } from "@rbxts/validate-tree";

const characterSchema = {
	$className: "Model",
	HumanoidRootPart: "BasePart",
	Humanoid: {
		$className: "Humanoid",
		Animator: "Animator",
	},
} as const;

export interface Character extends Model {
	HumanoidRootPart: BasePart;
	Humanoid: Humanoid & {
		Animator: Animator;
	};
}

export async function promiseCharacter(character: Model): Promise<Character> {
	return promiseTree(character, characterSchema).timeout(30, "Character timed out");
}

export async function promisePlayerDisconnected(player: Player): Promise<void> {
	if (!player.IsDescendantOf(Players)) {
		return;
	}

	await Promise.fromEvent(Players.PlayerRemoving, (playerWhoLeft) => playerWhoLeft === player);
}

export function getPlayerByName(name: string) {
	const player = Players.FindFirstChild(name);

	if (player?.IsA("Player")) {
		return player;
	}
}

export function onPlayerAdded(callback: (player: Player) => void) {
	const connection = Players.PlayerAdded.Connect(callback);

	for (const player of Players.GetPlayers()) {
		callback(player);
	}

	return () => connection.Disconnect();
}
