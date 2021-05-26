import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { LeftNavBarComponent } from "./components/left-nav-bar/left-nav-bar.component";
import { DrawerComponent } from "./components/drawer/drawer.component";
import { PrimaryLoaderComponent } from "./components/primary-loader/primary-loader.component";
import { MaterialModule } from "../material/material.module";
import { CoreService } from "./services/core.service";

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    LeftNavBarComponent,
    DrawerComponent,
    PrimaryLoaderComponent,
  ],
  imports: [CommonModule, RouterModule, HttpClientModule, MaterialModule],
  providers: [CoreService],
  exports: [
    LeftNavBarComponent,
    HeaderComponent,
    FooterComponent,
    DrawerComponent,
    PrimaryLoaderComponent,
  ],
})
export class CoreModule {}
