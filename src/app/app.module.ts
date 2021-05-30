import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CoreModule } from "./modules/core/core.module";
import { MaterialModule } from "./modules/material/material.module";
import { SettingsModule } from "./modules/settings/settings.module";
// import { UserManagementModule } from "./modules/user-management/user-management.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CoreModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    // UserManagementModule,
    SettingsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
