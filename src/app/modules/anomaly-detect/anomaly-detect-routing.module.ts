import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AnomalyDetailsComponent } from "./pages/anomaly-details/anomaly-details.component";
import { AnomalyDetectDashboardComponent } from "./pages/anomaly-detect-dashboard/anomaly-detect-dashboard.component";

const routes: Routes = [
  {
    path: "",
    component: AnomalyDetectDashboardComponent,
  },
  {
    path: "anomaly-details",
    component: AnomalyDetailsComponent,
  },
  { path: "**", redirectTo: "/cdm-anomaly-detect", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnomalyDetectRoutingModule {}
