import { MenuPage } from "./menu-slice";

export const MENU_PAGES: readonly MenuPage[] = ["support", "home", "skins"] as const;

/**
 * Returns the direction of the transition from one menu page to
 * another. Used for animating navigation fluidly.
 */
export function getMenuDirection(from: MenuPage, to: MenuPage) {
	const fromIndex = MENU_PAGES.indexOf(from);
	const toIndex = MENU_PAGES.indexOf(to);

	if (fromIndex === -1 || toIndex === -1) {
		throw `Invalid menu page: ${from} -> ${to}`;
	}

	return fromIndex < toIndex ? "right" : "left";
}
