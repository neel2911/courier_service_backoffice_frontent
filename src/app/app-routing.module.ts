import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  { path: "", redirectTo: "/settings", pathMatch: "full" },
  // {
  //   path: "theming-preview",
  //   loadChildren: () =>
  //     import("./modules/theming-preview/theming-preview.module").then(
  //       (m) => m.ThemingPreviewModule
  //     ),
  //   pathMatch: "full",
  // },

  {
    path: "user-management",
    loadChildren: () =>
      import("./modules/user-management/user-management.module").then(
        (m) => m.UserManagementModule
      ),
  },
  {
    path: "login",
    loadChildren: () =>
      import("./modules/login/login.module").then((m) => m.LoginModule),
  },
  {
    path: "settings",
    loadChildren: () =>
      import("./modules/settings/settings.module").then(
        (m) => m.SettingsModule
      ),
  },
  { path: "**", redirectTo: "/settings", pathMatch: "full" },
];

// , canActivate: [LoggedInGuardService]
@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
