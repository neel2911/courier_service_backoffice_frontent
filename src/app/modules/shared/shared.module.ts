import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TableLoaderComponent } from "./components/loaders/table-loader/table-loader.component";
import { FileUploadComponent } from "./components/file-upload/file-upload.component";
import { SanitizeHtmlPipe } from "./pipes/sanitize-html.pipe";
import { WidgetLoaderComponent } from "./components/loaders/widget-loader/widget-loader.component";

@NgModule({
  declarations: [
    FileUploadComponent,
    SanitizeHtmlPipe,
    TableLoaderComponent,
    WidgetLoaderComponent,
  ],
  imports: [CommonModule],
  exports: [FileUploadComponent, WidgetLoaderComponent],
})
export class SharedModule {}
