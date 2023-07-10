export interface Quadtree {
	/**
	 * The rectangle that this node represents.
	 */
	readonly rect: Rectangle;
	/**
	 * A set of items that are contained within this node.
	 */
	readonly items: Set<Vector3>;
	/**
	 * If this node has been split, this will be an array of the quadrants.
	 */
	readonly children: Quadtree[];
	/**
	 * Inserts an item into the quadtree. If the maximum number of items per
	 * node is exceeded, the node will be split.
	 */
	readonly insert: (item: Vector3) => void;
	/**
	 * Removes an item from the quadtree. Returns true if the item was removed,
	 * false if it was not found.
	 */
	readonly remove: (item: Vector3) => boolean;
	/**
	 * Replaces an item in the quadtree by removing the old item and inserting
	 * the new one.
	 */
	readonly replace: (item: Vector3, replacement: Vector3) => void;
	/**
	 * Returns all items that intersect with the given rectangle.
	 */
	readonly query: (boundary: Rectangle) => Vector3[];
	/**
	 * Returns all items that intersect with the given circle.
	 */
	readonly queryRange: (range: Range) => Vector3[];
	/**
	 * Removes all items from the quadtree.
	 */
	readonly clear: () => void;
	/**
	 * Returns the total number of items in the quadtree.
	 */
	readonly size: () => number;
}

export interface Rectangle {
	readonly position: Vector2;
	readonly size: Vector2;
}

export interface Range {
	readonly position: Vector2;
	readonly radius: number;
}

export interface QuadtreeOptions {
	readonly maxItems?: number;
	readonly maxDepth?: number;
}

export function createQuadtree(size: Vector2, { maxItems = 8, maxDepth = 4 }: QuadtreeOptions = {}): Quadtree {
	return createQuadtreeNode({ size, position: Vector2.zero }, 0, maxItems, maxDepth);
}

function createQuadtreeNode(rect: Rectangle, depth: number, maxItems: number, maxDepth: number): Quadtree {
	const items = new Set<Vector3>();
	const children: Quadtree[] = [];
	let length = 0;

	const split = () => {
		const halfSize = rect.size.div(2);

		const topLeft = createQuadtreeNode(
			{
				position: rect.position,
				size: halfSize,
			},
			depth + 1,
			maxItems,
			maxDepth,
		);

		const topRight = createQuadtreeNode(
			{
				position: rect.position.add(new Vector2(halfSize.X, 0)),
				size: halfSize,
			},
			depth + 1,
			maxItems,
			maxDepth,
		);

		const bottomLeft = createQuadtreeNode(
			{
				position: rect.position.add(new Vector2(0, halfSize.Y)),
				size: halfSize,
			},
			depth + 1,
			maxItems,
			maxDepth,
		);

		const bottomRight = createQuadtreeNode(
			{
				position: rect.position.add(halfSize),
				size: halfSize,
			},
			depth + 1,
			maxItems,
			maxDepth,
		);

		children.push(topLeft, topRight, bottomLeft, bottomRight);

		for (const item of items) {
			for (const child of children) {
				if (contains(child.rect, item)) {
					child.insert(item);
					break;
				}
			}
		}

		items.clear();
	};

	const insert = (item: Vector3) => {
		if (length < maxItems || depth >= maxDepth) {
			items.add(item);
			length += 1;
			return;
		}

		if (children.isEmpty()) {
			split();
		}

		for (const child of children) {
			if (contains(child.rect, item)) {
				child.insert(item);
				return;
			}
		}
	};

	const remove = (item: Vector3) => {
		if (items.delete(item)) {
			length -= 1;
			return true;
		}

		for (const child of children) {
			if (child.remove(item)) {
				return true;
			}
		}

		return false;
	};

	const replace = (item: Vector3, replacement: Vector3) => {
		remove(item);
		insert(replacement);
	};

	const query = (boundary: Rectangle) => {
		const result: Vector3[] = [];

		if (!intersects(rect, boundary)) {
			return result;
		}

		for (const item of items) {
			if (contains(boundary, item)) {
				result.push(item);
			}
		}

		for (const child of children) {
			for (const item of child.query(boundary)) {
				result.push(item);
			}
		}

		return result;
	};

	const queryRange = (range: Range) => {
		const result: Vector3[] = [];

		if (!intersectsCircle(rect, range)) {
			return result;
		}

		for (const item of items) {
			if (circleContains(range, item)) {
				result.push(item);
			}
		}

		for (const child of children) {
			for (const item of child.queryRange(range)) {
				result.push(item);
			}
		}

		return result;
	};

	const clear = () => {
		items.clear();
		children.clear();
		length = 0;
	};

	const size = () => {
		let result = items.size();

		for (const child of children) {
			result += child.size();
		}

		return result;
	};

	return { rect, items, children, insert, remove, replace, query, queryRange, clear, size };
}

/**
 * Returns true if the point falls anywhere within the given rectangle.
 */
export function contains(rect: Rectangle, item: Vector3) {
	return (
		item.X >= rect.position.X &&
		item.X <= rect.position.X + rect.size.X &&
		item.Y >= rect.position.Y &&
		item.Y <= rect.position.Y + rect.size.Y
	);
}

/**
 * Returns true if the point falls within the given circle.
 */
function circleContains(range: Range, item: Vector3) {
	return (item.X - range.position.X) ** 2 + (item.Y - range.position.Y) ** 2 <= range.radius ** 2;
}

/**
 * Returns true if the two rectangles intersect, or overlap.
 */
function intersects(rect: Rectangle, boundary: Rectangle) {
	return (
		rect.position.X < boundary.position.X + boundary.size.X &&
		rect.position.X + rect.size.X > boundary.position.X &&
		rect.position.Y < boundary.position.Y + boundary.size.Y &&
		rect.position.Y + rect.size.Y > boundary.position.Y
	);
}

/**
 * Returns true if the rectangle intersects the circle.
 */
function intersectsCircle(rect: Rectangle, range: Range) {
	const closestX = math.clamp(range.position.X, rect.position.X, rect.position.X + rect.size.X);
	const closestY = math.clamp(range.position.Y, rect.position.Y, rect.position.Y + rect.size.Y);

	const distanceX = range.position.X - closestX;
	const distanceY = range.position.Y - closestY;

	return distanceX * distanceX + distanceY * distanceY < range.radius ** 2;
}
