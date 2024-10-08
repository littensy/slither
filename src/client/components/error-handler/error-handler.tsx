import React from "@rbxts/react";
import { ErrorBoundary } from "client/components/ui/error-boundary";

import { ErrorPage } from "./error-page";

export function ErrorHandler({ children }: React.PropsWithChildren) {
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
