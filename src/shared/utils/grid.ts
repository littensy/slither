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

export class Grid<T = void> {
	public readonly cells = new Map<Vector3, GridCell<T>>();
	public readonly resolution: number;

	constructor(resolution: number) {
		this.resolution = resolution;
	}

	public insert(vector: Vector2, metadata: T) {
		const key = vectorize(this.snapToGrid(vector));
		const cell = this.cells.get(key) || new Map<Vector3, GridPoint<T>>();

		cell.set(vectorize(vector), {
			position: vector,
			metadata,
		});

		this.cells.set(key, cell);
	}

	public remove(vector: Vector2) {
		const key = vectorize(this.snapToGrid(vector));
		const cell = this.cells.get(key);

		if (!cell) {
			return;
		}

		cell.delete(vectorize(vector));

		if (cell.isEmpty()) {
			this.cells.delete(key);
		}
	}

	public replace(oldVector: Vector2, newVector: Vector2, metadata: T) {
		this.remove(oldVector);
		this.insert(newVector, metadata);
	}

	public nearest(
		vector: Vector2,
		range: number,
		predicate?: (point: GridPoint<T>) => boolean,
	): GridPoint<T> | undefined {
		const cellsInRange = this.getCellsInRange(vector, range);
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
	}

	public queryBox(position: Vector2, size: Vector2, predicate?: (point: GridPoint<T>) => boolean): GridPoint<T>[] {
		const cellsInBox = this.getCellsInBox(position, size);
		const points: GridPoint<T>[] = [];

		for (const cell of cellsInBox) {
			for (const [, point] of cell) {
				const isInsideRect =
					point.position.X >= position.X &&
					point.position.Y >= position.Y &&
					point.position.X <= position.X + size.X &&
					point.position.Y <= position.Y + size.Y;

				if (isInsideRect && (!predicate || predicate(point))) {
					points.push(point);
				}
			}
		}

		return points;
	}

	public queryRange(position: Vector2, range: number, predicate?: (point: GridPoint<T>) => boolean): GridPoint<T>[] {
		const cellsInRange = this.getCellsInRange(position, range);
		const points: GridPoint<T>[] = [];

		for (const cell of cellsInRange) {
			for (const [, point] of cell) {
				const distance = position.sub(point.position).Magnitude;

				if (distance <= range && (!predicate || predicate(point))) {
					points.push(point);
				}
			}
		}

		return points;
	}

	public clear() {
		this.cells.clear();
	}

	private snapToGrid(value: Vector2) {
		const x = math.floor(value.X / this.resolution);
		const y = math.floor(value.Y / this.resolution);
		return new Vector2(x, y);
	}

	private roundToGrid(value: Vector2) {
		const x = math.round(value.X / this.resolution);
		const y = math.round(value.Y / this.resolution);
		return new Vector2(x, y);
	}

	private getCellsInRange(vector: Vector2, range: number) {
		const cellsInRange: GridCell<T>[] = [];

		vector = this.snapToGrid(vector);
		range = math.ceil(range / this.resolution);

		for (const i of $range(-range, range)) {
			for (const j of $range(-range, range)) {
				const cell = this.cells.get(new Vector3(vector.X + i, vector.Y + j));
				cellsInRange.push(cell!);
			}
		}

		return cellsInRange;
	}

	private getCellsInBox(position: Vector2, size: Vector2) {
		const cellsInBox: GridCell<T>[] = [];

		position = this.snapToGrid(position);
		size = this.roundToGrid(size);

		for (const i of $range(-1, size.X + 1)) {
			for (const j of $range(-1, size.Y + 1)) {
				const cell = this.cells.get(new Vector3(position.X + i, position.Y + j));
				cellsInBox.push(cell!);
			}
		}

		return cellsInBox;
	}
}
