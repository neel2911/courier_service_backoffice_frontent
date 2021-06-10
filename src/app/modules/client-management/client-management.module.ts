import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClientManagementRoutingModule } from "./client-management-routing.module";
import { MaterialModule } from "../material/material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ClientManagementService } from "./services/client-manament.service";
import { D3Module } from "../visualization/d3-js/d3.module";
import { AngularSplitModule } from "angular-split";
import { SharedModule } from "../shared/shared.module";
import { ClientListComponent } from "./pages/client-list/client-list.component";
import { AddUpdateClientComponent } from './pages/add-update-client/add-update-client.component';

@NgModule({
  declarations: [ClientListComponent, AddUpdateClientComponent],
  imports: [
    CommonModule,
    ClientManagementRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    D3Module,
    AngularSplitModule,
    SharedModule,
  ],
  providers: [ClientManagementService],
  entryComponents: [],
})
export class ClientManagementModule {}
