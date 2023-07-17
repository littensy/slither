import { RunService } from "@rbxts/services";

interface SchedulerOptions {
	readonly interval: number;
	readonly phase?: number;
	readonly onTick?: (deltaTime: number) => void;
	readonly onRender?: (deltaTime: number, alpha: number) => void;
}

export function createScheduler({ interval, phase, onTick, onRender }: SchedulerOptions) {
	let timer = phase ?? 0;

	const connection = RunService.Heartbeat.Connect((deltaTime) => {
		const frameTime = math.min(deltaTime, interval);

		timer += frameTime;

		while (timer >= interval) {
			timer -= interval;
			onTick?.(interval);
		}

		onRender?.(frameTime, timer / interval);
	});

	return () => {
		connection.Disconnect();
	};
}
