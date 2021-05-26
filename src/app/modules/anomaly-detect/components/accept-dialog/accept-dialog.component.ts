import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-accept-dialog",
  templateUrl: "./accept-dialog.component.html",
  styleUrls: ["./accept-dialog.component.scss"],
})
export class AcceptDialogComponent implements OnInit {
  public isLoading = false;
  public isShowingLabel = false;
  public actionType: "accept" | "reject" = "accept";
  public label = "Query sent to the site";
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AcceptDialogComponent>
  ) {}

  ngOnInit(): void {}

  onSendQuery() {
    this.isLoading = true;
    setTimeout(() => {
      // this.isShowingLabel = true;
      this.isLoading = false;
      // setTimeout(() => {
      //   this.isShowingLabel = false;
      // }, 1000);
      this.dialogRef.close(
        this.actionType === "accept"
          ? "Query sent to the site."
          : "Feedback Submitted."
      );
    }, 1000);
  }
}
