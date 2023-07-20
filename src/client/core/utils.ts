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
