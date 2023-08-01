import { useSelectorCreator } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { Group } from "client/app/common/group";
import { useRem } from "client/app/hooks";
import { LOCAL_USER } from "shared/constants";
import { remotes } from "shared/remotes";
import { selectCurrentPlayerSkin, selectPlayerSkins } from "shared/store/saves";
import { SkinCard } from "./skin-card";
import { RANDOM_SKIN } from "./utils";

const DIRECTIONS = [-3, -2, -1, 0, 1, 2, 3];

export function SkinCarousel() {
	const rem = useRem();
	const skinInventory = useSelectorCreator(selectPlayerSkins, LOCAL_USER) || [];
	const currentSkin = useSelectorCreator(selectCurrentPlayerSkin, LOCAL_USER) ?? RANDOM_SKIN;

	const skins = [RANDOM_SKIN, ...skinInventory];
	const skinsLength = skins.size();
	const currentIndex = skins.indexOf(currentSkin);

	return (
		<Group size={new UDim2(1, 0, 1, -rem(3))}>
			{DIRECTIONS.map((direction) => {
				const index = (currentIndex + direction) % skinsLength;
				const skin = skins[index] ?? RANDOM_SKIN;
				const id = skin !== RANDOM_SKIN ? skin : undefined;

				return (
					<SkinCard
						key={skin}
						id={skin}
						index={direction}
						onClick={() => {
							remotes.save.setSkin.fire(id);
						}}
					/>
				);
			})}
		</Group>
	);
}
