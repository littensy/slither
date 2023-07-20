import { createGrid } from "server/utils/grid";
import { benchmark } from "shared/utils/benchmark";
import { fillArray } from "shared/utils/object-utils";

export = benchmark({
	parameters: () => {
		const grid = createGrid(25);
		const set = new Set<Vector3>();
		const vectors: Vector2[] = [];

		for (const index of $range(0, 5000)) {
			const random = new Random(index);
			const vector = new Vector2(random.NextNumber(0, 1000), random.NextNumber(0, 1000));
			grid.insert(vector);
			set.add(new Vector3(vector.X, vector.Y, 0));
			vectors.push(vector);
		}

		const queries = fillArray(10, (index) => {
			return index * 5;
		});

		const replacements = fillArray(100, (index) => {
			const from = vectors[index * 10];
			const to = vectors[1000 - index * 10];
			return [from, to];
		});

		return {
			grid,
			set,
			queries,
			replacements,
		};
	},

	functions: {
		grid: (profiler, { grid, queries, replacements }) => {
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
