import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";

export const onLeftSidePanelChange = trigger("onLeftSidePanelChange", [
  state(
    "close",
    style({
      "min-width": "50px",
    })
  ),
  state(
    "open",
    style({
      "min-width": "200px",
    })
  ),
  transition("close => open", animate("250ms ease-in")),
  transition("open => close", animate("250ms ease-in")),
]);

export const onMainContentChange = trigger("onMainContentChange", [
  state(
    "close",
    style({
      "margin-left": "62px",
    })
  ),
  state(
    "open",
    style({
      "margin-left": "200px",
    })
  ),
  transition("close => open", animate("250ms ease-in")),
  transition("open => close", animate("250ms ease-in")),
]);

export const onHeaderChange = trigger("onHeaderChange", [
  state(
    "close",
    style({
      width: "calc(100% - 57px)",
    })
  ),
  state(
    "open",
    style({
      width: "calc(100% - 200px)",
    })
  ),
  transition("close => open", animate("250ms ease-in")),
  transition("open => close", animate("250ms ease-in")),
]);

export const animateText = trigger("animateText", [
  state(
    "hide",
    style({
      display: "none",
      opacity: 0,
    })
  ),
  state(
    "show",
    style({
      display: "inline-block",
      opacity: 1,
    })
  ),
  transition("hide => show", animate("350ms ease-in")),
  transition("show => hide", animate("200ms ease-out")),
]);
