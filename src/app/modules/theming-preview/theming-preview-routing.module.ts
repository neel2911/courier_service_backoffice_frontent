import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { PreviewComponentsComponent } from "./pages/preview-components/preview-components.component";

const routes: Routes = [
  { path: "", component: PreviewComponentsComponent },
  { path: "**", redirectTo: "/theming-preview", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThemingPreviewRoutingModule {}
