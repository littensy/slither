import { RootState } from "../";
import { MenuPage } from "./menu-slice";

export const selectCurrentPage = (state: RootState) => {
	return state.menu.page;
};

export const selectIsMenuOpen = (state: RootState) => {
	return state.menu.open;
};

export const selectIsPage = (page: MenuPage) => {
	return (state: RootState) => state.menu.page === page;
};

export const selectMenuTransition = (state: RootState) => {
	return state.menu.transition;
};

export const selectMenuCurrentSkin = (state: RootState) => {
	return state.menu.skins.current;
};
