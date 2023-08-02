import { useSelector } from "@rbxts/react-reflex";
import Roact, { useEffect } from "@rbxts/roact";
import { Text } from "client/app/common/text";
import { useRem, useStore } from "client/app/hooks";
import { palette } from "shared/data/palette";
import { selectHasLocalSnake } from "shared/store/snakes";
import { Home } from "./home";
import { MenuContainer } from "./menu-container";
import { MenuVignette } from "./menu-vignette";
import { Navigation } from "./navigation";
import { Skins } from "./skins";

export function Menu() {
	const store = useStore();
	const rem = useRem();
	const spawned = useSelector(selectHasLocalSnake);

	useEffect(() => {
		store.setMenuOpen(!spawned);
	}, [spawned]);

	return (
		<>
			<MenuVignette />

			<MenuContainer>
				<Navigation />
			</MenuContainer>

			<MenuContainer page="home">
				<Home />
			</MenuContainer>

			<MenuContainer page="support">
				<Text text="TODO" textColor={palette.text} size={new UDim2(1, 0, 1, 0)} />
			</MenuContainer>

			<MenuContainer page="skins">
				<Skins />
			</MenuContainer>
		</>
	);
}
