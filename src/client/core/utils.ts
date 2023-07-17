/**
 * Continue to retry a function until it succeeds or the max number
 * of retries is reached. Waits 0.1 seconds between each retry.
 */
export async function retryCore(callback: () => void) {
	return Promise.retry(async () => {
		try {
			callback();
		} catch (e) {
			return Promise.delay(0.1).then(() => Promise.reject(e));
		}
	}, 8);
}

/**
 * Create a BindableEvent that calls the given callback when fired.
 */
export function coreEvent<T extends Callback>(callback: T) {
	const event = new Instance("BindableEvent");
	event.Event.Connect(callback);
	return event;
}
