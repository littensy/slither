import Roact from "@rbxts/roact";
import { IS_EDIT } from "shared/constants";

import { Group } from "./group";

interface RootProps extends Roact.PropsWithChildren {
	displayOrder?: number;
}

export function Root({ displayOrder, children }: RootProps) {
	return IS_EDIT ? (
		<Group zIndex={displayOrder}>{children}</Group>
	) : (
		<screengui ResetOnSpawn={false} DisplayOrder={displayOrder} IgnoreGuiInset ZIndexBehavior="Sibling">
			{children}
		</screengui>
	);
}
