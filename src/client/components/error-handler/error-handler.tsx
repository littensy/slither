import React from "@rbxts/react";
import { ErrorBoundary } from "client/components/ui/error-boundary";

import { ErrorPage } from "./error-page";

interface ErrorHandlerProps extends React.PropsWithChildren {}

export function ErrorHandler({ children }: ErrorHandlerProps) {
	return (
		<ErrorBoundary
			fallback={(message) => {
				return <ErrorPage message={message} />;
			}}
		>
			{children}
		</ErrorBoundary>
	);
}
