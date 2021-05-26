import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ClinicalDataSolutionsComponent } from "./clinical-data-solutions.component";
import { SolutionListComponent } from "./pages/solution-list/solution-list.component";

const routes: Routes = [
  {
    path: "solution-list",
    component: ClinicalDataSolutionsComponent,
    children: [
      { path: "", component: SolutionListComponent },
      { path: "**", redirectTo: "solution-list", pathMatch: "full" },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClinicalDataSolutionsRoutingModule {}
