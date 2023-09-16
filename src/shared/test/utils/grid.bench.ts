import { benchmark } from "shared/utils/benchmark";
import { Grid } from "shared/utils/grid";
import { fillArray } from "shared/utils/object-utils";

export = benchmark({
	parameters: () => {
		const grid = new Grid(35);
		const set = new Set<Vector3>();
		const vectors: Vector2[] = [];

		for (const index of $range(0, 3000)) {
			const random = new Random(index);
			const vector = new Vector2(random.NextNumber(0, 1000), random.NextNumber(0, 1000));
			set.add(new Vector3(vector.X, vector.Y, 0));
			vectors.push(vector);
		}

		const queries = fillArray(20, (index) => {
			return index * 5;
		});

		const replacements = fillArray(3000, (index) => {
			const from = vectors[index];
			const to = from.add(new Vector2(0.5, 0.5));
			return [from, to];
		});

		return {
			grid,
			set,
			queries,
			vectors,
			replacements,
		};
	},

	functions: {
		grid: (profiler, { set, grid, queries, vectors, replacements }) => {
			profiler.Begin("populate");
			for (const vector of vectors) {
				grid.insert(vector);
			}
			profiler.End();

			profiler.Begin("nearest");
			for (const query of queries) {
				grid.nearest(new Vector2(query, query), 100);
			}
			profiler.End();

			profiler.Begin("replace");
			for (const [from, to] of replacements) {
				grid.replace(from, to);
			}
			profiler.End();
		},

		bruteforce: (profiler, { set, queries, replacements }) => {
			profiler.Begin("populate");
			for (const vector of set) {
				set.add(vector);
			}
			profiler.End();

			profiler.Begin("nearest");
			for (const query of queries) {
				const queryVector = new Vector3(query, query, 0);
				let nearest: Vector3 | undefined;
				let nearestDistance = query;

				for (const vector of set) {
					const distance = vector.sub(queryVector).Magnitude;

					if (distance < nearestDistance) {
						nearest = vector;
						nearestDistance = distance;
					}
				}
			}
			profiler.End();

			profiler.Begin("replace");
			for (const [from, to] of replacements) {
				set.delete(new Vector3(from.X, from.Y, 0));
				set.add(new Vector3(to.X, to.Y, 0));
			}
			profiler.End();
		},
	},
});
