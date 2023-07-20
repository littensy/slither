interface Grid<T> {
	readonly cells: ReadonlyMap<Vector3, GridCell<T>>;
	readonly insert: (vector: Vector2, metadata: T) => void;
	readonly remove: (vector: Vector2) => void;
	readonly replace: (oldVector: Vector2, newVector: Vector2, metadata: T) => void;
	readonly nearest: (
		vector: Vector2,
		range: number,
		predicate?: (point: GridPoint<T>) => boolean,
	) => GridPoint<T> | undefined;
	readonly clear: () => void;
}

type GridCell<T> = Map<Vector3, GridPoint<T>>;

interface GridPoint<T> {
	readonly position: Vector2;
	readonly metadata: T;
}

/**
 * Cast this object to a Vector3 to use it as a key.
 */
function vectorize({ X, Y }: Vector2) {
	return new Vector3(X, Y, 0);
}

export function createGrid<T = void>(resolution: number): Grid<T> {
	const cells = new Map<Vector3, GridCell<T>>();

	const snapToGrid = (value: Vector2) => {
		const x = math.floor(value.X / resolution);
		const y = math.floor(value.Y / resolution);
		return new Vector2(x, y);
	};

	const getCellsInRange = (vector: Vector2, range: number) => {
		const cellsInRange: GridCell<T>[] = [];

		vector = snapToGrid(vector);
		range = math.floor(range / resolution);

		for (const i of $range(-range, range)) {
			for (const j of $range(-range, range)) {
				const cell = cells.get(new Vector3(vector.X + i, vector.Y + j));

				if (cell) {
					cellsInRange.push(cell);
				}
			}
		}

		return cellsInRange;
	};

	const insert = (vector: Vector2, metadata: T) => {
		const key = vectorize(snapToGrid(vector));
		const cell = cells.get(key) || new Map<Vector3, GridPoint<T>>();

		cell.set(vectorize(vector), {
			position: vector,
			metadata,
		});

		cells.set(key, cell);
	};

	const remove = (vector: Vector2) => {
		const key = vectorize(snapToGrid(vector));
		const cell = cells.get(key);

		if (!cell) {
			return;
		}

		cell.delete(vectorize(vector));

		if (cell.isEmpty()) {
			cells.delete(key);
		}
	};

	const replace = (oldVector: Vector2, newVector: Vector2, metadata: T) => {
		remove(oldVector);
		insert(newVector, metadata);
	};

	const nearest = (vector: Vector2, range: number, predicate?: (point: GridPoint<T>) => boolean) => {
		const cellsInRange = getCellsInRange(vector, range);
		let nearestPoint: GridPoint<T> | undefined;
		let nearestDistance = range;

		for (const cell of cellsInRange) {
			for (const [, point] of cell) {
				const distance = vector.sub(point.position).Magnitude;

				if (distance < nearestDistance && (!predicate || predicate(point))) {
					nearestPoint = point;
					nearestDistance = distance;
				}
			}
		}

		return nearestPoint;
	};

	const clear = () => {
		cells.clear();
	};

	return { cells, insert, remove, replace, nearest, clear };
}
