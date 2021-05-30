import {
  Component,
  OnInit,
  Input,
  ViewChildren,
  ElementRef,
  QueryList,
  Output,
  EventEmitter,
  ViewChild,
} from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";

@Component({
  selector: "app-table-with-sub-table",
  templateUrl: "./table-with-sub-table.component.html",
  styleUrls: ["./table-with-sub-table.component.scss"],
  animations: [
    trigger("detailExpand", [
      state(
        "collapsed",
        style({ height: "0px", minHeight: "0", display: "none" })
      ),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class TableWithSubTableComponent implements OnInit {
  @Input() tableConfig: any = null;
  @Input() tableRecords: any = [];
  @Input() subTableConfig: any = null;
  @Input() filterText: string = "";

  @Output() evtEmitter: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) pageinator: MatPaginator;
  @ViewChildren("matRow", { read: ElementRef }) matRow: QueryList<ElementRef>;

  public dataSource: MatTableDataSource<any>;
  public selection: SelectionModel<any> = new SelectionModel<any>(true, []);
  public expandedAll = false;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes) {
    if (changes.tableConfig) {
      this.configureTable();
    }

    if (changes.tableRecords && !changes.tableRecords.firstChange) {
      this.setTableRecords();
    }

    if (changes.filterText) {
      this.applyFilter(this.filterText);
    }
  }

  configureTable() {
    this.setTableRecords();
  }

  setTableRecords() {
    this.selection.clear();
    this.dataSource = new MatTableDataSource(this.tableRecords);
    this.dataSource.sort = this.sort;
    if (this.tableConfig.hasPaginator) {
      this.dataSource.paginator = this.pageinator;
    }
    this.dataSource.filterPredicate = (data, filter: string): boolean => {
      return this.tableConfig.filerableColumns.some((v) =>
        data[v].toString().toLowerCase().includes(filter.toString())
      );
    };
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.dataSource.data.forEach((row) => {
        row.detectedAnomaly.data.forEach((subRow) =>
          row.detectedAnomalySelection.deselect(subRow)
        );
      });
    } else {
      this.dataSource.data.forEach((row) => {
        this.selection.select(row);
        row.detectedAnomaly.data.forEach((subRow) =>
          row.detectedAnomalySelection.select(subRow)
        );
      });
    }
    this.commonEmitter({
      selected: this.selection.selected,
      type: "selection",
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterAllSubToggle(row) {
    this.isAllSubSelected(row)
      ? row.detectedAnomalySelection.clear()
      : row.detectedAnomaly.data.forEach((subRow) =>
          row.detectedAnomalySelection.select(subRow)
        );

    this.selection.toggle(row);
    this.commonEmitter({
      selected: this.selection.selected,
      type: "selection",
    });
  }

  isAllSubSelected(row) {
    const numSelected = row.detectedAnomalySelection.selected.length;
    const numRows = row.detectedAnomaly.data.length;
    return numSelected === numRows;
  }

  toggleSubRecord(element, row) {
    element.detectedAnomalySelection.toggle(row);

    if (
      element.detectedAnomalySelection.selected.length ===
      element.detectedAnomaly.data.length
    ) {
      this.selection.select(element);
    } else {
      // if (element.detectedAnomalySelection.selected.length === 0)
      this.selection.deselect(element);
    }
    this.commonEmitter({
      selected: this.selection.selected,
      type: "selection",
    });
  }

  commonEmitter(data) {
    console.log(data);
    this.evtEmitter.emit(data);
  }

  onCollapsibleHeaderClick() {
    this.expandedAll = !this.expandedAll;
    this.matRow.forEach((row) => {
      if (
        this.expandedAll &&
        !row.nativeElement.classList.contains("expanded")
      ) {
        row.nativeElement.click();
      } else if (
        !this.expandedAll &&
        row.nativeElement.classList.contains("expanded")
      ) {
        row.nativeElement.click();
      }
    });
  }

  public applyFilter(filterValue: string) {
    this.filterText = filterValue.trim();
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // onSortClick(key, direction, isAlphaBetic = false) {
  //   this.sortActiveOn = key;
  //   this.sortDirection = direction;

  //   this.data.sort((a, b) => {
  //     let x;
  //     const i = isAlphaBetic
  //       ? (a[key] || "").toString().toLowerCase()
  //       : +a[key];
  //     const j = isAlphaBetic
  //       ? (b[key] || "").toString().toLowerCase()
  //       : +b[key];
  //     x = i > j ? -1 : i < j ? 1 : 0;
  //     return x * (this.sortDirection === "desc" ? 1 : -1);
  //   });

  //   this.dataSource.data = [...this.data];
  // }

  // onTableScrollLoadData(e) {
  //   console.log(e);
  //   const tableViewHeight = e.target.offsetHeight; // viewport
  //   const tableScrollHeight = e.target.scrollHeight; // length of all table
  //   const scrollLocation = e.target.scrollTop; // how far user scrolled

  //   // If the user has scrolled within 200px of the bottom, add more data
  //   const buffer = 200;
  //   const limit = tableScrollHeight - tableViewHeight - buffer;
  //   if (scrollLocation > limit) {
  //     this.updateIndex();
  //     const data = this.getTableLoadedData(this.start, this.end);
  //     this.dataSource.data = this.dataSource.data.concat(data);
  //     this.isAllSelected();
  //   }
  // }

  // getTableLoadedData(start, end) {
  //   return this.tableData.records.filter(
  //     (value, index) => index >= start && index < end
  //   );
  // }

  // updateIndex() {
  //   this.start = this.end;
  //   this.end = this.limit + this.start;
  // }
}
