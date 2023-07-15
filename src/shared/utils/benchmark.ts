interface Benchmark<T> {
	readonly parameters?: () => T;
	readonly functions: {
		readonly [key: string]: (profiler: BenchmarkProfiler, parameters: T) => void;
	};
}

export interface BenchmarkProfiler {
	readonly Begin: (name: string) => void;
	readonly End: () => void;
}

const noop = () => undefined as never;

/**
 * Create a benchmarker for the Benchmarker plugin by boatbomber.
 */
export function benchmark<T>({ parameters = noop, functions }: Benchmark<T>): unknown {
	return {
		ParameterGenerator: parameters,
		Functions: functions,
	};
}
