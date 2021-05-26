import { Injectable, EventEmitter } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { CustomEventType } from "../modules/shared/enum/enum";
@Injectable({
  providedIn: "root",
})
export class AppService {
  public solutionList = [];
  public breadCrumbConfigList = [
    {
      name: "Anomaly Detect",
      link: "/cdm-anomaly-detect",
      isPreviousRoutesReset: true,
      routeDepth: 1,
    },
    {
      name: "User Management",
      link: "/user-management",
      isPreviousRoutesReset: true,
      routeDepth: 1,
    },
    {
      name: "Themeing Preview",
      link: "/theming-preview",
      isPreviousRoutesReset: false,
      routeDepth: -1,
    },
    {
      name: "Anomaly Details",
      link: "/anomaly-details",
      isPreviousRoutesReset: false,
      routeDepth: -1,
    },
  ];
  public breadCrumb = [
    {
      name: "Clinical Data Solutions",
      link: "/",
    },
  ];
  public onCustomEvent: EventEmitter<any> = new EventEmitter<any>();
  public isLeftSidePanelOpen$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);
  public isDrawerOpen$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public widgetLoader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor() {}

  updateCustomEvent(obj) {
    this.onCustomEvent.next(obj);
  }

  togglePrimaryLoader(value) {
    this.onCustomEvent.next({
      event: CustomEventType.TOGGLE_PRIMARY_LOADER,
      data: value,
    });
  }

  setLeftSidePanelStatus(value: boolean) {
    this.isLeftSidePanelOpen$.next(value);
  }

  setDrawerStatus(value: boolean) {
    this.isDrawerOpen$.next(value);
  }

  updateBreadCrumb(url) {
    if (this.breadCrumbConfigList.length > 0) {
      const currentRoutConfig = this.breadCrumbConfigList.find(
        (b) => b.link === url
      );

      if (currentRoutConfig) {
        if (currentRoutConfig.isPreviousRoutesReset) {
          this.breadCrumb.splice(
            currentRoutConfig.routeDepth,
            this.breadCrumb.length - 1
          );
        }
        this.breadCrumb.push({
          name: currentRoutConfig.name,
          link: currentRoutConfig.link,
        });
      } else {
        this.breadCrumb = [
          {
            name: "Clinical Data Solutions",
            link: "/",
          },
        ];
      }
    }
  }
  getBreadCrumb() {
    return this.breadCrumb;
  }
}
