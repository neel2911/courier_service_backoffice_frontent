import { Component, OnInit, Inject, Optional, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTable, MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-history-dialog-box",
  templateUrl: "./history-dialog-box.component.html",
  styleUrls: ["./history-dialog-box.component.scss"],
})
export class HistoryDialogBoxComponent implements OnInit {
  @ViewChild(MatTable) table: MatTable<any>;
  public userHistoryData: MatTableDataSource<any>;
  public displayedColumns = ["createdAt", "ipAddress"];
  constructor(
    public dialogRef: MatDialogRef<HistoryDialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userHistoryData = new MatTableDataSource(data);
  }

  ngOnInit() {}
}
