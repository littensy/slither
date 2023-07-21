import { FunctionComponent } from "@rbxts/roact";

export function profiler<P extends object>(name: string, render: FunctionComponent<P>) {
	return (props: P) => {
		debug.profilebegin(name);
		const result = render(props);
		debug.profileend();
		return result;
	};
}
