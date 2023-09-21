import { useSelector, useSelectorCreator } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { Group } from "client/app/common/group";
import { useDefined, useRem, useStore } from "client/app/hooks";
import { LOCAL_USER } from "shared/constants";
import { selectPlayerBalance } from "shared/store/saves";
import { selectLocalSnakeScore, selectRankForDisplay } from "shared/store/snakes";

import { StatsCard } from "./stats-card";

export function Stats() {
	const rem = useRem();
	const store = useStore();

	const currentScore = useSelector(selectLocalSnakeScore);
	const currentRank = useSelector(selectRankForDisplay);
	const currentBalance = useSelectorCreator(selectPlayerBalance, LOCAL_USER);

	// displays the previous value if any are set to undefined
	const score = useDefined(currentScore, 0);
	const rank = useDefined(currentRank, "99th");
	const balance = useDefined(currentBalance, 0);

	return (
		<Group>
			<uipadding key="margin" PaddingBottom={new UDim(0, rem(3))} PaddingLeft={new UDim(0, rem(3))} />

			<uilistlayout
				key="layout"
				FillDirection="Vertical"
				HorizontalAlignment="Left"
				VerticalAlignment="Bottom"
				Padding={new UDim(0, rem(1))}
				SortOrder="LayoutOrder"
			/>

			<StatsCard
				key="rank"
				emoji="🏆"
				label="RANK"
				value={rank}
				primary={Color3.fromRGB(255, 203, 80)}
				secondary={Color3.fromRGB(255, 150, 79)}
				enabled={currentRank !== undefined}
				order={0}
			/>

			<StatsCard
				key="score"
				emoji="💯"
				label="SCORE"
				value={`${score}`}
				primary={Color3.fromRGB(181, 64, 64)}
				secondary={Color3.fromRGB(150, 59, 84)}
				enabled={currentScore !== undefined}
				order={1}
			/>

			<StatsCard
				key="balance"
				onClick={() => {
					if (currentScore === undefined) {
						// Only show the support page if the user is not playing
						store.setMenuPage("support");
					}
				}}
				emoji="💵"
				label="MONEY"
				value={`$${balance}`}
				primary={Color3.fromRGB(111, 158, 79)}
				secondary={Color3.fromRGB(153, 181, 107)}
				enabled={currentBalance !== undefined}
				order={2}
			/>
		</Group>
	);
}
