import { RunService } from "@rbxts/services";

interface SchedulerOptions {
	readonly name: string;
	readonly tick: number;
	readonly phase?: number;
	readonly onTick?: (deltaTime: number) => void;
	readonly onRender?: (deltaTime: number, alpha: number) => void;
}

const connected = new Set<RBXScriptConnection>();

export function createScheduler({ name, tick, phase, onTick, onRender }: SchedulerOptions) {
	let timer = phase ?? 0;

	const connection = RunService.Heartbeat.Connect((deltaTime) => {
		const frameTime = math.min(deltaTime, tick);

		timer += frameTime;

		while (timer >= tick) {
			timer -= tick;
			debug.profilebegin(name);
			onTick?.(tick);
			debug.profileend();
		}

		onRender?.(frameTime, timer / tick);
	});

	connected.add(connection);

	return () => {
		connection.Disconnect();
		connected.delete(connection);
	};
}

export function disconnectAllSchedulers() {
	for (const connection of connected) {
		connection.Disconnect();
	}

	connected.clear();
}
