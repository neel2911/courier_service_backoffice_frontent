import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TableLoaderComponent } from "./components/loaders/table-loader/table-loader.component";
import { FileUploadComponent } from "./components/file-upload/file-upload.component";
import { SanitizeHtmlPipe } from "./pipes/sanitize-html.pipe";
import { WidgetLoaderComponent } from "./components/loaders/widget-loader/widget-loader.component";
import { TableWithSubTableComponent } from "./components/table-with-sub-table/table-with-sub-table.component";
import { DefaultTableComponent } from "./components/default-table/default-table.component";
import { MaterialModule } from "../material/material.module";
import { UploadPricingFilesComponent } from "./components/upload-pricing-files/upload-pricing-files.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    FileUploadComponent,
    SanitizeHtmlPipe,
    TableLoaderComponent,
    WidgetLoaderComponent,
    TableWithSubTableComponent,
    DefaultTableComponent,
    UploadPricingFilesComponent,
  ],
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
  exports: [
    FileUploadComponent,
    WidgetLoaderComponent,
    TableWithSubTableComponent,
    DefaultTableComponent,
    UploadPricingFilesComponent,
  ],
})
export class SharedModule {}
