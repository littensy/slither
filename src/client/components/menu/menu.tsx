import { useSelector } from "@rbxts/react-reflex";
import Roact, { useEffect } from "@rbxts/roact";
import { useStore } from "client/hooks";
import { selectHasLocalSnake } from "shared/store/snakes";

import { Home } from "./home";
import { MenuContainer } from "./menu-container";
import { MenuVignette } from "./menu-vignette";
import { Navigation } from "./navigation";
import { Skins } from "./skins";
import { Support } from "./support";

export function Menu() {
	const store = useStore();
	const spawned = useSelector(selectHasLocalSnake);

	useEffect(() => {
		store.setMenuOpen(!spawned);
	}, [spawned]);

	return (
		<>
			<MenuVignette key="vignette" />

			<MenuContainer key="navbar-container">
				<Navigation key="navbar" />
			</MenuContainer>

			<MenuContainer key="home-container" page="home">
				<Home key="home" />
			</MenuContainer>

			<MenuContainer key="support-container" page="support">
				<Support key="support" />
			</MenuContainer>

			<MenuContainer key="skins-container" page="skins">
				<Skins key="skins" />
			</MenuContainer>
		</>
	);
}
