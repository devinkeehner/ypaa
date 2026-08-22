export type NavigationWarningDetail = {
  label: string;
  url: string;
  newTab?: boolean;
};

export function requestNavigationWarning(
  event: React.MouseEvent<HTMLAnchorElement>,
  detail: NavigationWarningDetail & { showWarning?: boolean },
) {
  if (!detail.showWarning || typeof window === "undefined") return;
  const warningEvent = new CustomEvent<NavigationWarningDetail>("ypaa:confirm-navigation", {
    cancelable: true,
    detail: { label: detail.label, url: detail.url, newTab: detail.newTab },
  });
  if (!window.dispatchEvent(warningEvent)) event.preventDefault();
}
