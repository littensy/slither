import Roact, { createElement, FunctionComponent } from "@rbxts/roact";

export function profiler<P extends object>(name: string, render: FunctionComponent<P>): FunctionComponent<P> {
	return (props: P) => {
		debug.profilebegin(name);
		const result = render(props);
		debug.profileend();
		return result;
	};
}

export function profileAllComponents() {
	const profiledComponents = new Map<FunctionComponent, FunctionComponent>();

	const getName = (callback: Callback) => {
		const [name = "Component"] = debug.info(callback, "n");
		return name;
	};

	Roact.createElement = ((...args: Parameters<typeof Roact.createElement>) => {
		const [component] = args;

		if (typeIs(component, "function")) {
			let profiledComponent = profiledComponents.get(component);

			if (!profiledComponent) {
				profiledComponent = profiler(getName(component), component);
				profiledComponents.set(component, profiledComponent);
			}

			args[0] = profiledComponent as never;
		}

		return createElement(...args);
	}) as Callback;
}
