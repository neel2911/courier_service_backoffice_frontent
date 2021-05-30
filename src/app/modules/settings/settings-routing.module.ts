import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SettingListComponent } from "./pages/setting-list/setting-list.component";
import { SettingComponent } from "./pages/setting/setting.component";

const routes: Routes = [
  { path: "", component: SettingListComponent },
  { path: "roles", component: SettingComponent },
  { path: "**", redirectTo: "/settings", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
