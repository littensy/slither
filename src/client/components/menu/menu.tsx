import React, { useEffect } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
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
			<MenuVignette />

			<MenuContainer>
				<Navigation />
			</MenuContainer>

			<MenuContainer page="home">
				<Home />
			</MenuContainer>

			<MenuContainer page="support">
				<Support />
			</MenuContainer>

			<MenuContainer page="skins">
				<Skins />
			</MenuContainer>
		</>
	);
}
