import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TableLoaderComponent } from "./components/loaders/table-loader/table-loader.component";
import { FileUploadComponent } from "./components/file-upload/file-upload.component";
import { SanitizeHtmlPipe } from "./pipes/sanitize-html.pipe";
import { WidgetLoaderComponent } from "./components/loaders/widget-loader/widget-loader.component";
import { TableWithSubTableComponent } from "./components/table-with-sub-table/table-with-sub-table.component";
import { DefaultTableComponent } from "./components/default-table/default-table.component";
import { MaterialModule } from "../material/material.module";

@NgModule({
  declarations: [
    FileUploadComponent,
    SanitizeHtmlPipe,
    TableLoaderComponent,
    WidgetLoaderComponent,
    TableWithSubTableComponent,
    DefaultTableComponent,
  ],
  imports: [CommonModule, MaterialModule],
  exports: [
    FileUploadComponent,
    WidgetLoaderComponent,
    TableWithSubTableComponent,
    DefaultTableComponent,
  ],
})
export class SharedModule {}
