import Roact from "@rbxts/roact";
import { ErrorBoundary } from "client/app/common/error-boundary";

import { ErrorPage } from "./error-page";

interface ErrorHandlerProps extends Roact.PropsWithChildren {}

export function ErrorHandler({ children }: ErrorHandlerProps) {
	return <ErrorBoundary fallback={(message) => <ErrorPage message={message} />}>{children}</ErrorBoundary>;
}
