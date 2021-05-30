import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "../material/material.module";
import { SettingsService } from "./service/settings.service";
import { D3Module } from "../visualization/d3-js/d3.module";
import { AngularSplitModule } from "angular-split";
import { SettingsRoutingModule } from "./settings-routing.module";
import { SettingListComponent } from "./pages/setting-list/setting-list.component";

@NgModule({
  declarations: [SettingListComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    MaterialModule,
    D3Module,
    AngularSplitModule,
  ],
  providers: [SettingsService],
})
export class SettingsModule {}
