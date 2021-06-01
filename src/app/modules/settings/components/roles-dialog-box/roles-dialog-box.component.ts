import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { SettingsService } from "../../service/settings.service";

@Component({
  selector: "app-roles-dialog-box",
  templateUrl: "./roles-dialog-box.component.html",
  styleUrls: ["./roles-dialog-box.component.scss"],
})
export class RolesDialogBoxComponent implements OnInit {
  public minStartDate: Date;
  public roleForm: FormGroup;
  public dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  public displayedColumns = [
    "moduleName",
    "read",
    "create",
    "update",
    "delete",
  ];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<RolesDialogBoxComponent>,
    private _settingsService: SettingsService
  ) {
    const role = { ...(data.data || {}) };

    console.log(role);
    this.roleForm = formBuilder.group(
      {
        roleName: [role.roleName || "", [Validators.required]],
        description: [role.description || "", Validators.required],
        status: [role.status || false, Validators.nullValidator],
      },
      { updateOn: "blur" }
    );

    this.dataSource.data = [...role.permission];
  }

  ngOnInit() {}

  onRoleSave() {
    console.log(this.roleForm);
    if (this.roleForm.invalid) {
      return false;
    }
    const role = { ...this.data.data, ...this.roleForm.value };
    console.log(this.dataSource.data);
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
