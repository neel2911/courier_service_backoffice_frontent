import { DOCUMENT } from "@angular/common";
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";

import { NavigationEnd, NavigationStart, Router } from "@angular/router";
import { onMainContentChange } from "./modules/core/animations/left-side-panel-animation";
import { AuthService } from "./modules/core/auth/auth.service";
import { MatNotificationService } from "./modules/material/services/mat-notification.service";
import {
  CustomEventType,
  DrawerMode,
  DrawerPosition,
  NotificationType,
} from "./modules/shared/enum/enum";
import { AppService } from "./services/app.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  protected _isAdmin = false;
  protected _themes = ["primary-theme"];
  protected _currentThemeIndex = 0;
  protected _isDark = false;

  public breadCrumbs = [];
  public isDashboard = false;
  public isLoggedIn = true;
  public isDrawerOpen = false;
  public isShowPrimaryLoader = false;
  public isLeftSidePanelOpen = false;

  @ViewChild("drawer") drawer: ElementRef;

  get DrawerMode() {
    return DrawerMode;
  }

  get DrawerPosition() {
    return DrawerPosition;
  }

  get theme(): string {
    return this._themes[this._currentThemeIndex];
  }

  constructor(
    private _renderer: Renderer2,
    private _router: Router,
    private _appService: AppService,
    private _authService: AuthService,
    private _notification: MatNotificationService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this._addCustomClass(document.body, this.theme);
    this._addCustomClass(document.body, this._isDark ? "dark" : "light");
  }

  ngOnInit() {
    this.breadCrumbs = [...this._appService.getBreadCrumb()];
    this._appService.isLeftSidePanelOpen$.subscribe({
      complete: null,
      error: null,
      next: (v) => {
        this.isLeftSidePanelOpen = v;
      },
    });
    this._authService.onUserInfoUpate$.subscribe((data) => {
      if (data) {
        this._isAdmin = data.isAdmin;
        this.isLoggedIn = true;
      } else {
        this._isAdmin = false;
        this.isLoggedIn = true;
        // this.isLeftSidePanelOpen = false;
      }
    });

    this._initCustomRouteEvents();
    this._initCustomEvents();
  }

  toggleLeftSidePanelHandler(value) {
    console.log(value);
    value ? this.onLeftSidePanelOpen() : this.onLeftSidePanelClose();
  }

  onLeftSidePanelOpen() {
    this.isLeftSidePanelOpen = true;
    this._appService.setLeftSidePanelStatus(true);
  }

  onLeftSidePanelClose() {
    this.isLeftSidePanelOpen = false;
    this._appService.setLeftSidePanelStatus(false);
  }

  onDrawerOpen() {
    this._appService.setDrawerStatus(true);
  }
  onDrawerClose() {
    this._appService.setDrawerStatus(false);
  }

  togglePrimaryLoader(value) {
    setTimeout(() => {
      this.isShowPrimaryLoader = value;
    }, 0);
  }

  updateTheme() {
    this._removeCustomClass(document.body, this._isDark ? "light" : "dark");
    this._addCustomClass(document.body, this._isDark ? "dark" : "light");
  }

  private _addCustomClass(el, className) {
    this._renderer.addClass(el, className);
  }
  private _removeCustomClass(el, className) {
    this._renderer.removeClass(el, className);
  }

  private _initCustomRouteEvents() {
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
      }

      if (event instanceof NavigationEnd) {
        this.isDashboard = false;
        if (event.url === "/solution-list" || event.url === "/") {
          this.isDashboard = true;
        }
        this._appService.updateBreadCrumb(event.url);
        document.scrollingElement.scrollTo(0, 0);
        this.isDrawerOpen = false;
        this.breadCrumbs = [...this._appService.getBreadCrumb()];
      }
    });
  }
  private _initCustomEvents() {
    this._appService.onCustomEvent.subscribe(($e) => {
      // console.log($e);
      switch ($e.event) {
        case CustomEventType.TOGGLE_PRIMARY_LOADER:
          this.togglePrimaryLoader($e.data);
          break;
        case CustomEventType.ADD_CLASS_TO_BODY:
          this._addCustomClass(document.body, $e.data);
          break;
        case CustomEventType.REMOVE_CLASS_TO_BODY:
          this._removeCustomClass(document.body, $e.data);
          break;
        case CustomEventType.SHOW_TOAST_MESSAGE:
          switch ($e.data.type) {
            case NotificationType.SUCCESS:
              this._notification.success($e.data.message);
              break;
            case NotificationType.ERROR:
              this._notification.error($e.data.message);
              break;
            default:
              this._notification.default($e.data.message);
              break;
          }
          break;
      }
    });
  }
}
