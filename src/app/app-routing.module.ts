import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  { path: "", redirectTo: "/user-management", pathMatch: "full" },
  // {
  //   path: "theming-preview",
  //   loadChildren: () =>
  //     import("./modules/theming-preview/theming-preview.module").then(
  //       (m) => m.ThemingPreviewModule
  //     ),
  //   pathMatch: "full",
  // },
  // {
  //   path: "cdm-anomaly-detect",
  //   loadChildren: () =>
  //     import("./modules/anomaly-detect/anomaly-detect.module").then(
  //       (m) => m.AnomalyDetectModule
  //     ),
  // },
  {
    path: "user-management",
    loadChildren: () =>
      import("./modules/user-management/user-management.module").then(
        (m) => m.UserManagementModule
      ),
    pathMatch: "full",
  },
  {
    path: "login",
    loadChildren: () =>
      import("./modules/login/login.module").then((m) => m.LoginModule),
  },
  { path: "**", redirectTo: "/user-management", pathMatch: "full" },
];

// , canActivate: [LoggedInGuardService]
@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
