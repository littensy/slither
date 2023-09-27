import { TextChatService } from "@rbxts/services";
import { promiseTree } from "@rbxts/validate-tree";

interface EnhancedTextChatService extends TextChatService {
	TextChannels: Folder & {
		RBXGeneral: TextChannel;
		RBXSystem: TextChannel;
	};
	TextChatCommands: Folder;
}

const textChatServiceSchema = {
	$className: "TextChatService",
	TextChannels: {
		$className: "Folder",
		RBXGeneral: "TextChannel",
		RBXSystem: "TextChannel",
	},
	TextChatCommands: "Folder",
} as const;

async function promiseTextChatService(): Promise<EnhancedTextChatService> {
	return promiseTree(TextChatService, textChatServiceSchema);
}

export async function getTextChannels() {
	const { TextChannels } = await promiseTextChatService();
	return TextChannels;
}

export async function getTextChatCommands() {
	const { TextChatCommands } = await promiseTextChatService();
	return TextChatCommands;
}
