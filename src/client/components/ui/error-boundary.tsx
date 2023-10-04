import Roact from "@rbxts/roact";

interface ReactErrorInfo {
	readonly componentStack: string;
}

interface ErrorBoundaryProps {
	readonly fallback: (error: unknown) => Roact.Element;
}

interface ErrorBoundaryState {
	readonly hasError: boolean;
	readonly message?: unknown;
}

export class ErrorBoundary extends Roact.Component<ErrorBoundaryProps, ErrorBoundaryState> {
	public readonly state: ErrorBoundaryState = { hasError: false };

	constructor(props: ErrorBoundaryProps) {
		super(props);
	}

	public componentDidCatch(message: unknown, errorInfo: ReactErrorInfo) {
		warn(message, errorInfo.componentStack);

		this.setState({
			hasError: true,
			message: `${message} ${errorInfo.componentStack}`,
		});
	}

	public render() {
		if (this.state.hasError) {
			return this.props.fallback(this.state.message);
		}

		return this.props.children as Roact.Element | undefined;
	}
}
