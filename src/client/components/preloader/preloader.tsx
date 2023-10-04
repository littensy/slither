import { useAsyncEffect, useDeferState } from "@rbxts/pretty-react-hooks";
import Roact, { useMemo } from "@rbxts/roact";
import { ContentProvider } from "@rbxts/services";
import { images, sounds } from "shared/assets";

import { useRem } from "../../hooks";
import { Text } from "../ui/text";

interface Assets {
	[key: string]: string | Assets;
}

export function Preloader() {
	const rem = useRem();

	const [contentIds, contentNamesById] = useMemo(() => {
		const contentIds: string[] = [];
		const contentNamesById = new Map<string, string>();

		const scan = (assets: Assets, prefix = "") => {
			for (const [name, asset] of pairs(assets)) {
				if (typeIs(asset, "string")) {
					contentIds.push(asset);
					contentNamesById.set(asset, `${prefix}${name}`);
				} else {
					scan(asset, `${prefix}${name}/`);
				}
			}
		};

		scan(images, "images/");
		scan(sounds, "sounds/");

		return [contentIds, contentNamesById] as const;
	}, []);

	const [currentAsset, setCurrentAsset] = useDeferState<string>();

	useAsyncEffect(async () => {
		ContentProvider.PreloadAsync(contentIds, (assetId) => {
			setCurrentAsset(contentNamesById.get(assetId));
		});

		setCurrentAsset(undefined);
	}, []);

	if (currentAsset === undefined) {
		return <></>;
	}

	return (
		<Text
			text={`Loading ${currentAsset}`}
			textSize={rem(2)}
			textXAlignment="Right"
			textYAlignment="Bottom"
			textColor={Color3.fromRGB(255, 255, 255)}
			textTransparency={0.2}
			position={new UDim2(1, rem(-2), 1, rem(-2))}
		>
			<uistroke
				key="stroke"
				Thickness={rem(0.1)}
				Color={Color3.fromRGB(0, 0, 0)}
				Transparency={0.5}
				ApplyStrokeMode="Contextual"
			/>
		</Text>
	);
}
