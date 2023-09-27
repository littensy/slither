export function lerp(a: number, b: number, t: number) {
	return a + (b - a) * t;
}

export function lerpStrict(a: number, b: number, t: number) {
	return math.clamp(lerp(a, b, t), math.min(a, b), math.max(a, b));
}

export function map(value: number, min: number, max: number, newMin: number, newMax: number) {
	if (min === max) {
		return newMin;
	}
	return lerp(newMin, newMax, (value - min) / (max - min));
}

export function mapStrict(value: number, min: number, max: number, newMin: number, newMax: number) {
	if (min === max) {
		return newMin;
	}
	return lerpStrict(newMin, newMax, (value - min) / (max - min));
}

export function subtractRadians(a: number, b: number) {
	return math.atan2(math.sin(a - b), math.cos(a - b));
}

export function addRadians(a: number, b: number) {
	return math.atan2(math.sin(a + b), math.cos(a + b));
}

export function lerpRadians(a: number, b: number, t: number) {
	return addRadians(a, subtractRadians(b, a) * t);
}

export function turnRadians(current: number, target: number, angle: number) {
	const difference = subtractRadians(target, current);
	const sign = math.sign(difference);
	const amount = math.min(math.abs(difference), angle);
	return current + amount * sign;
}
