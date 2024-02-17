import React from "@rbxts/react";

interface ErrorBoundaryProps {
	readonly fallback: (error: unknown) => React.Element;
}

interface ErrorBoundaryState {
	readonly hasError: boolean;
	readonly message?: unknown;
}

export const ErrorBoundary: React.FC<ErrorBoundaryProps>;
