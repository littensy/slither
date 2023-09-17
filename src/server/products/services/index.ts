import { initMoneyService } from "./money";
import { initProcessReceiptService } from "./process-receipt";

export async function initProductServices() {
	initMoneyService();
	initProcessReceiptService();
}
