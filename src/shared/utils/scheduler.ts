import { RunService } from "@rbxts/services";

interface SchedulerOptions {
	readonly name: string;
	readonly interval: number;
	readonly phase?: number;
	readonly onTick?: (deltaTime: number) => void;
	readonly onRender?: (deltaTime: number, alpha: number) => void;
}

export function createScheduler({ name, interval, phase, onTick, onRender }: SchedulerOptions) {
	let timer = phase ?? 0;

	const connection = RunService.Heartbeat.Connect((deltaTime) => {
		const frameTime = math.min(deltaTime, interval);

		timer += frameTime;

		while (timer >= interval) {
			timer -= interval;
			debug.profilebegin(name);
			onTick?.(interval);
			debug.profileend();
		}

		onRender?.(frameTime, timer / interval);
	});

	return () => {
		connection.Disconnect();
	};
}
