import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { environment } from "src/environments/environment";
import { UserManagementService } from "../../services/user-management.service";
@Component({
  selector: "app-user-dialog-box",
  templateUrl: "./user-dialog-box.component.html",
  styleUrls: ["./user-dialog-box.component.scss"],
})
export class UserDialogBoxComponent implements OnInit {
  public minStartDate: Date;
  public userForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<UserDialogBoxComponent>,
    private _userManagementService: UserManagementService
  ) {
    const user = { ...(data.user || {}) };
    const today = new Date();
    const currentDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    this.minStartDate = currentDate;
    if (data.isUpdate && currentDate > user.accessStartDate) {
      this.minStartDate = user.accessStartDate;
    }
    this.userForm = formBuilder.group(
      {
        employeeId: [user.employeeId || "", [Validators.required]],
        name: [user.name || "", Validators.required],
        userName: [user.userName || "", Validators.required],
        role: [user.role || "", Validators.required],
        contactNumber: [
          user.contactNumber || "",
          [
            Validators.required,
            Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
          ],
        ],
        emailId: [user.emailId || "", [Validators.required, Validators.email]],
        address: [user.address || "", Validators.required],
        accessStartDate: [
          user.accessStartDate || currentDate,
          Validators.required,
        ],
        accessEndDate: [user.accessEndDate, Validators.required],
        description: [user.description || "", Validators.required],
        status: [user.accessStatus || false, Validators.nullValidator],
      },
      { updateOn: "blur" }
    );
  }

  ngOnInit() {}

  onUserSave() {
    if (this.userForm.invalid) {
      return false;
    }
    const user = { ...this.data.user, ...this.userForm.value };
    const requestUser = this._userManagementService.parseUserObj(user, false);

    if (this.data.isUpdate) {
      this._userManagementService
        .updateUser(requestUser)
        .subscribe((data: any) => {
          this.dialogRef.close(data);
        });
    } else {
      this._userManagementService
        .addUser(requestUser)
        .subscribe((data: any) => {
          console.log(data);
        });
    }
  }
}
