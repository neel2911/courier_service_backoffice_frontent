import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AnomalyDetectRoutingModule } from "./anomaly-detect-routing.module";
import { AnomalyDetectDashboardComponent } from "./pages/anomaly-detect-dashboard/anomaly-detect-dashboard.component";
import { MaterialModule } from "../material/material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AnomalyDetectService } from "./services/anomaly-detect.service";
import { D3Module } from "../visualization/d3-js/d3.module";
import { AngularSplitModule } from "angular-split";
import { AnomalyDetectDashboardService } from "./services/anomaly-detect-dashboard.service";
import { AcceptDialogComponent } from "./components/accept-dialog/accept-dialog.component";
import { RejectDialogComponent } from "./components/reject-dialog/reject-dialog.component";
import { ReviewDialogComponent } from "./components/review-dialog/review-dialog.component";
import { SharedModule } from "../shared/shared.module";
import { AnomalyDetailsComponent } from './pages/anomaly-details/anomaly-details.component';
import { PageLevelFilterComponent } from './components/page-level-filter/page-level-filter.component';

@NgModule({
  declarations: [
    AnomalyDetectDashboardComponent,
    AcceptDialogComponent,
    RejectDialogComponent,
    ReviewDialogComponent,
    AnomalyDetailsComponent,
    PageLevelFilterComponent,
  ],
  imports: [
    CommonModule,
    AnomalyDetectRoutingModule,
    MaterialModule,
    D3Module,
    AngularSplitModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [AnomalyDetectService, AnomalyDetectDashboardService],
  entryComponents: [
    AcceptDialogComponent,
    RejectDialogComponent,
    ReviewDialogComponent,
    PageLevelFilterComponent
  ],
})
export class AnomalyDetectModule {}
