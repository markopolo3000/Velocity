import Tab from "~/data/Tab";
import { tabStack } from "~/data/appState";
import Preferences from "~/types/Preferences";

export default function clickHandler(event: MouseEvent) {
  const element = getAnchor(event.target);
  if (element && element.href) {
    if (event.ctrlKey) {
      open(event, element.href, false, false);
    } else if (event.shiftKey) {
      open(event, element.href, true, false);
    } else if (element.target === "_blank") {
      open(event, element.href, false, true);
    } else if (element.target === "_parent") {
      navigate(event, element.href);
    } else if (element.target === "_top") {
      navigate(event, element.href);
    }
  }
}

function open(
  event: MouseEvent,
  url: string,
  isWindow: boolean,
  isBlank: boolean
) {
  event.preventDefault();
  const preferences: Preferences = JSON.parse(
    localStorage.getItem("preferences") || "{}"
  );
  if (isWindow && !preferences["general.tabs.openWindowLinksInTab"]) {
    window.open(`${location.origin}?url=${encodeURIComponent(url)}`);
  } else {
    new Tab(url, preferences["general.tabs.switchToMedia"] || isBlank);
  }
}

function navigate(event: MouseEvent, url: string) {
  event.preventDefault();
  Array.from(tabStack())[0].navigate(url);
}

function getAnchor(element: EventTarget | null): HTMLAnchorElement | undefined {
  if (!element) return;
  const target = element as HTMLElement;
  if (target.tagName === "A") {
    return target as HTMLAnchorElement;
  } else if (target.parentElement) {
    return getAnchor(target.parentElement);
  } else {
    return;
  }
}
