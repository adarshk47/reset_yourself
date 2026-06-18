import { TestIds } from "react-native-google-mobile-ads";

/**
 * Google's test ad unit is used in dev builds so testing never serves real
 * ads against the production ad unit (a Google AdMob policy requirement).
 */
export const REWARDED_AD_UNIT_ID = __DEV__
  ? TestIds.REWARDED
  : "ca-app-pub-4083049312549641/1859256004";
