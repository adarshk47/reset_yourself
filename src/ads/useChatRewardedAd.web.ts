// Google Mobile Ads SDK is Android/iOS only; the bonus-wisdom ad is hidden on web.
export function useChatRewardedAd() {
  return {
    isLoaded: false,
    isEarnedReward: false,
    isClosed: false,
    load: () => {},
    show: () => {},
  };
}
