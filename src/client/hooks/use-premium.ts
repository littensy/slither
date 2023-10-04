import { useEventListener } from "@rbxts/pretty-react-hooks";
import { useState } from "@rbxts/roact";
import { Players } from "@rbxts/services";

export function usePremium() {
	const [isPremium, setIsPremium] = useState(Players.LocalPlayer.MembershipType === Enum.MembershipType.Premium);

	useEventListener(Players.PlayerMembershipChanged, (player) => {
		if (player === Players.LocalPlayer) {
			setIsPremium(player.MembershipType === Enum.MembershipType.Premium);
		}
	});

	return isPremium;
}
