import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "../material/material.module";
import { SettingsService } from "./service/settings.service";
import { D3Module } from "../visualization/d3-js/d3.module";
import { AngularSplitModule } from "angular-split";
import { SettingsRoutingModule } from "./settings-routing.module";
import { SettingListComponent } from "./pages/setting-list/setting-list.component";
import { SettingComponent } from "./pages/setting/setting.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UserManagementService } from "../user-management/services/user-management.service";
import { RolesDialogBoxComponent } from "./components/roles-dialog-box/roles-dialog-box.component";
import { NetworksDialogBoxComponent } from "./components/networks-dialog-box/networks-dialog-box.component";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [
    SettingListComponent,
    SettingComponent,
    RolesDialogBoxComponent,
    NetworksDialogBoxComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule,
    D3Module,
    AngularSplitModule,
    SettingsRoutingModule,
  ],
  providers: [SettingsService, UserManagementService],
  entryComponents: [RolesDialogBoxComponent, NetworksDialogBoxComponent],
})
export class SettingsModule {}
