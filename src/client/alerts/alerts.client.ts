import { connectRankAlerts } from "./handlers/alert-ranks";
import { connectRemoteAlerts } from "./handlers/alert-remote";

connectRemoteAlerts();
connectRankAlerts();
