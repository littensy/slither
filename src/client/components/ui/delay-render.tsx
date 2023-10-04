import Roact, { useEffect, useState } from "@rbxts/roact";
import { setTimeout } from "@rbxts/set-timeout";

interface DelayRenderProps extends Roact.PropsWithChildren {
	shouldRender: boolean;
	mountDelay?: number;
	unmountDelay?: number;
}

export function DelayRender({ shouldRender, mountDelay = 0, unmountDelay = 0, children }: DelayRenderProps) {
	const [render, setRender] = useState(false);

	useEffect(() => {
		if (shouldRender) {
			return setTimeout(() => setRender(true), mountDelay);
		} else {
			return setTimeout(() => setRender(false), unmountDelay);
		}
	}, [shouldRender]);

	return <>{render && children}</>;
}
