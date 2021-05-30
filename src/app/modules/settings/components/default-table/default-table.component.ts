import { SelectionModel } from "@angular/cdk/collections";
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ViewChildren,
  ElementRef,
  QueryList,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-default-table",
  templateUrl: "./default-table.component.html",
  styleUrls: ["./default-table.component.scss"],
})
export class DefaultTableComponent implements OnInit {
  @Input() tableConfig: any = null;
  @Input() tableRecords: any = [];
  @Input() filterText: string = "";

  @Output() evtEmitter: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) pageinator: MatPaginator;

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

  public applyFilter(filterValue: string) {
    this.filterText = filterValue.trim();
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
