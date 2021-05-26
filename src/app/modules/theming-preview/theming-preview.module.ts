import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ThemingPreviewRoutingModule } from "./theming-preview-routing.module";
import { PreviewComponentsComponent } from "./pages/preview-components/preview-components.component";
import { MaterialModule } from "../material/material.module";
import { ThemingPreviewService } from "./service/theming-preview.service";

@NgModule({
  declarations: [PreviewComponentsComponent],
  imports: [CommonModule, ThemingPreviewRoutingModule, MaterialModule],
  providers: [ThemingPreviewService],
})
export class ThemingPreviewModule {}
