import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { MatTable } from "@angular/material/table";

@Directive({
  selector: "[cdkResizeColumn]",
})
export class CdkResizeColumnDirective {
  @Input() index = -1;
  @Input() columns = [];
  @Input() displayedColumns = [];
  @Input() matTableRef: any;

  // @ViewChild(MatTable, { read: ElementRef }) ;
  pressed = false;
  currentResizeIndex: number;
  startX: number;
  startWidth: number;
  isResizingRight: boolean;
  resizableMousemove: () => void;
  resizableMouseup: () => void;

  constructor(public vcRef: ViewContainerRef, private renderer: Renderer2) {}

  setTableResize(tableWidth: number) {
    let totWidth = 0;
    this.columns.forEach((column) => {
      totWidth += column.width;
    });
    const scale = (tableWidth - 5) / totWidth;
    this.columns.forEach((column) => {
      column.width *= scale;
      this.setColumnWidth(column);
    });
  }

  setDisplayedColumns() {
    this.columns.forEach((column, index) => {
      column.index = index;
      this.displayedColumns[index] = column.field;
    });
  }

  @HostListener("mousedown", ["$event"])
  onResizeColumn(event) {
    console.log(event.target.parentElement);
    this.checkResizing(event, this.index);
    this.currentResizeIndex = this.index;
    this.pressed = true;
    this.startX = event.pageX;
    this.startWidth = event.target.parentElement.clientWidth;
    event.preventDefault();
    this.mouseMove(this.index);
  }

  private checkResizing(event, index) {
    const cellData = this.getCellData(index);
    if (
      index === 0 ||
      (Math.abs(event.pageX - cellData.right) < cellData.width / 2 &&
        index !== this.columns.length - 1)
    ) {
      this.isResizingRight = true;
    } else {
      this.isResizingRight = false;
    }
  }

  private getCellData(index: number) {
    const headerRow = this.matTableRef._elementRef.nativeElement.children[0];
    const cell = headerRow.children[index];
    return cell.getBoundingClientRect();
  }

  mouseMove(index: number) {
    this.resizableMousemove = this.renderer.listen(
      "document",
      "mousemove",
      (event) => {
        if (this.pressed && event.buttons) {
          const dx = this.isResizingRight
            ? event.pageX - this.startX
            : -event.pageX + this.startX;
          const width = this.startWidth + dx;
          if (this.currentResizeIndex === index && width > 50) {
            this.setColumnWidthChanges(index, width);
          }
        }
      }
    );
    this.resizableMouseup = this.renderer.listen(
      "document",
      "mouseup",
      (event) => {
        if (this.pressed) {
          this.pressed = false;
          this.currentResizeIndex = -1;
          this.resizableMousemove();
          this.resizableMouseup();
        }
      }
    );
  }

  setColumnWidthChanges(index: number, width: number) {
    const orgWidth = this.columns[index].width;
    const dx = width - orgWidth;
    if (dx !== 0) {
      const j = this.isResizingRight ? index + 1 : index - 1;
      const newWidth = this.columns[j].width - dx;
      if (newWidth > 50) {
        this.columns[index].width = width;
        this.setColumnWidth(this.columns[index]);
        this.columns[j].width = newWidth;
        this.setColumnWidth(this.columns[j]);
      }
    }
  }

  setColumnWidth(column: any) {
    const columnEls = Array.from(
      document.getElementsByClassName("mat-column-" + column.field)
    );
    columnEls.forEach((el: HTMLDivElement) => {
      el.style.width = column.width + "px";
    });
  }

  //   @HostListener("window:resize", ["$event"])
  //   onResize(event) {
  //     this.setTableResize(this.matTableRef.nativeElement.clientWidth);
  //   }
}
