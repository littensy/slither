import { Animatable, config, SpringOptions } from "@rbxts/ripple";

export const springs = {
	...config,
	bubbly: { tension: 400, friction: 14 },
	responsive: { tension: 400 },
	gentle: { tension: 250, friction: 30 },
	world: { tension: 180, friction: 30 },
} satisfies { [config: string]: SpringOptions<Animatable> };
