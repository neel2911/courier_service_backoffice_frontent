import { NgModule } from "@angular/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRadioModule } from "@angular/material/radio";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSliderModule } from "@angular/material/slider";
import { MatMenuModule } from "@angular/material/menu";
import { MatCardModule } from "@angular/material/card";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatBadgeModule } from "@angular/material/badge";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatNotificationService } from "./services/mat-notification.service";
import { MatPaginatorIntlCustomService } from "./services/mat-paginator-intl-custom.service";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatListModule } from "@angular/material/list";
import { CdkTableModule } from "@angular/cdk/table";
import { MatChipsModule } from "@angular/material/chips";
import { A11yModule } from "@angular/cdk/a11y";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { CdkTreeModule } from "@angular/cdk/tree";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import {
  MatPaginatorModule,
  MatPaginatorIntl,
} from "@angular/material/paginator";

import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import icons from "./icons";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { CdkDetailRowDirective } from "./directives/cdk-detail-row.directive";
import { CdkResizeColumnDirective } from "./directives/cdk-resize-column.directive";

@NgModule({
  declarations: [CdkDetailRowDirective, CdkResizeColumnDirective],
  imports: [
    ScrollingModule,
    CdkTreeModule,
    DragDropModule,
    A11yModule,
    CdkTableModule,
    MatButtonModule,
    MatInputModule,
    MatRadioModule,
    MatIconModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatBadgeModule,
    MatSliderModule,
    MatCardModule,
    MatTableModule,
    MatDialogModule,
    MatSortModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatGridListModule,
    MatTabsModule,
    MatSelectModule,
    MatTooltipModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatDividerModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatAutocompleteModule,
    MatChipsModule,
  ],
  exports: [
    CdkResizeColumnDirective,
    CdkDetailRowDirective,
    ScrollingModule,
    CdkTreeModule,
    DragDropModule,
    A11yModule,
    CdkTableModule,
    MatButtonModule,
    MatInputModule,
    MatSliderModule,
    MatBadgeModule,
    MatMenuModule,
    MatCardModule,
    MatRadioModule,
    MatIconModule,
    MatTableModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatSortModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatGridListModule,
    MatTabsModule,
    MatSelectModule,
    MatTooltipModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatDividerModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatAutocompleteModule,
    MatChipsModule,
  ],
  providers: [
    {
      // floatLabel: "always"
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: "outline" },
    },
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlCustomService },
    MatNotificationService,
  ],
})
export class MaterialModule {
  constructor(
    protected iconRegistry: MatIconRegistry,
    protected sanitizer: DomSanitizer
  ) {
    icons.forEach((icon) => {
      iconRegistry.addSvgIcon(
        icon.icon_name,
        sanitizer.bypassSecurityTrustResourceUrl(icon.icon_path)
      );
    });
  }
}
