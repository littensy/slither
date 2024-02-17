import React, { useEffect, useState } from "@rbxts/react";
import { setTimeout } from "@rbxts/set-timeout";

interface DelayRenderProps extends React.PropsWithChildren {
	shouldRender: boolean;
	mountDelay?: number;
	unmountDelay?: number;
}

export function DelayRender({ shouldRender, mountDelay = 0, unmountDelay = 0, children }: DelayRenderProps) {
	const [render, setRender] = useState(false);

	useEffect(() => {
		return setTimeout(() => setRender(shouldRender), shouldRender ? mountDelay : unmountDelay);
	}, [shouldRender]);

	return <>{render && children}</>;
}
