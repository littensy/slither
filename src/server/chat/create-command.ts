import Make from "@rbxts/make";
import { Players } from "@rbxts/services";
import { getTextChatCommands } from "./text-chat-service";

const ADMINS = new ReadonlySet([48203430]);

export async function createCommand(alias: string, handler: (player: Player, argument: string) => void) {
	const onTrigger = (origin: TextSource, unfilteredText: string) => {
		const player = Players.GetPlayerByUserId(origin.UserId);

		if (player && ADMINS.has(origin.UserId)) {
			const argument = unfilteredText.sub(2 + alias.size());
			handler(player, argument);
		}
	};

	Make("TextChatCommand", {
		PrimaryAlias: alias,
		Parent: await getTextChatCommands(),
		Triggered: onTrigger,
	});
}
