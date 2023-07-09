import { useAsyncEffect, useDeferState } from "@rbxts/pretty-react-hooks";
import Roact, { useMemo } from "@rbxts/roact";
import { ContentProvider } from "@rbxts/services";
import { images, sounds } from "shared/assets";
import { Text } from "../common/text";
import { useRem } from "../hooks";

export function Preloader() {
	const rem = useRem();

	const [contentIds, contentNamesById] = useMemo(() => {
		const contentIds: string[] = [];
		const contentNamesById = new Map<string, string>();

		for (const [name, id] of pairs({ ...images, ...sounds })) {
			contentIds.push(id);
			contentNamesById.set(id, `${name in images ? "images" : "sounds"}/${name}`);
		}

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
			textSize={2 * rem}
			textXAlignment="Right"
			textYAlignment="Bottom"
			textColor={Color3.fromRGB(255, 255, 255)}
			textTransparency={0.2}
			position={new UDim2(1, -2 * rem, 1, -2 * rem)}
		>
			<uistroke
				Thickness={0.1 * rem}
				Color={Color3.fromRGB(0, 0, 0)}
				Transparency={0.5}
				ApplyStrokeMode="Contextual"
			/>
		</Text>
	);
}
