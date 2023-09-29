import { map, useInterval } from "@rbxts/pretty-react-hooks";
import { useState } from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { useRem } from "client/app/hooks";
import { WORLD_BOUNDS } from "shared/constants";

export const MINIMUM_MINIMAP_REM = 10;

export function useMinimapRem() {
	return useRem({ minimum: MINIMUM_MINIMAP_REM });
}

export function useFriendsInServer() {
	const [friends, setFriends] = useState<string[]>([]);

	const updateFriendship = async (player: Player) => {
		if (!friends.includes(player.Name) && player.IsFriendsWith(Players.LocalPlayer.UserId)) {
			setFriends((friends) => [...friends, player.Name]);
		}
	};

	const updateFriends = async () => {
		const processes = Players.GetPlayers().map(updateFriendship);
		return Promise.allSettled(processes);
	};

	useInterval(updateFriends, 10, { immediate: true });

	return friends;
}

export function isValidPlayer(name: string) {
	return Players.FindFirstChild(name)?.IsA("Player") || false;
}

export function normalizeToWorldBounds(vector: Vector2) {
	return new Vector2(
		map(vector.X, -WORLD_BOUNDS, WORLD_BOUNDS, 0, 1),
		map(vector.Y, -WORLD_BOUNDS, WORLD_BOUNDS, 0, 1),
	);
}
