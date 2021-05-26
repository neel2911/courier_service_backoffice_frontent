import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClinicalDataSolutionsRoutingModule } from "./clinical-data-solutions-routing.module";
import { MaterialModule } from "../material/material.module";
import { ClinicalDataSolutionsService } from "./service/clinical-data-solutions.service";
import { D3Module } from "../visualization/d3-js/d3.module";
import { AngularSplitModule } from "angular-split";
import { SolutionListComponent } from "./pages/solution-list/solution-list.component";
import { ClinicalDataSolutionsComponent } from "./clinical-data-solutions.component";

@NgModule({
  declarations: [ClinicalDataSolutionsComponent, SolutionListComponent],
  imports: [
    CommonModule,
    ClinicalDataSolutionsRoutingModule,
    MaterialModule,
    D3Module,
    AngularSplitModule,
  ],
  providers: [ClinicalDataSolutionsService],
})
export class ClinicalDataSolutionsModule {}
