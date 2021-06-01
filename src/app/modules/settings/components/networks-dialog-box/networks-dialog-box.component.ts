import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { SettingsService } from "../../service/settings.service";

@Component({
  selector: "app-networks-dialog-box",
  templateUrl: "./networks-dialog-box.component.html",
  styleUrls: ["./networks-dialog-box.component.scss"],
})
export class NetworksDialogBoxComponent implements OnInit {
  public minStartDate: Date;
  public networkForm: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NetworksDialogBoxComponent>,
    private _settingsService: SettingsService
  ) {
    const network = { ...(data.data || {}) };

    console.log(network);
    this.networkForm = formBuilder.group(
      {
        networkName: [network.networkName || "", [Validators.required]],
        contactNumber: [
          network.contactNumber || "",
          [
            Validators.required,
            Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
          ],
        ],
        emailId: [
          network.emailId || "",
          [Validators.required, Validators.email],
        ],
        address: [network.address || "", Validators.required],
        status: [network.status || false, Validators.nullValidator],
      },
      { updateOn: "blur" }
    );
  }

  ngOnInit() {}

  onNetworkSave() {
    console.log(this.networkForm);
    if (this.networkForm.invalid) {
      return false;
    }
    const network = { ...this.data.data, ...this.networkForm.value };
    if (this.data.isUpdate) {
      // this._settingsService
      //   .updateUser(requestUser)
      //   .subscribe((data: any) => {
      //     this.dialogRef.close(data);
      //   });
    } else {
      // this._settingsService
      //   .addUser(requestUser)
      //   .subscribe((data: any) => {
      //     console.log(data);
      //   });
    }
  }
}
