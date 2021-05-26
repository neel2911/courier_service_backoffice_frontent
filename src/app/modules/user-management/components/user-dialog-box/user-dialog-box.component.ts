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
  public errorMsg: string;
  public appURL = environment.app_URL;
  showSubmitButton = true;
  generatedAccessCode = "";
  generateResponse = null;

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
    this.errorMsg = data.errorMsg;
    this.minStartDate = currentDate;
    if (data.isUpdate && currentDate > user.accessStartDate) {
      this.minStartDate = user.accessStartDate;
    }
    this.userForm = formBuilder.group(
      {
        clientName: [user.clientName || "", [Validators.required]],
        requesterName: [user.requesterName || "", Validators.required],
        accessStartDate: [
          user.accessStartDate || currentDate,
          Validators.required,
        ],
        accessEndDate: [user.accessEndDate, Validators.required],
        accessReason: [user.accessReason || "", Validators.required],
        accessStatus: [
          user.accessStatus !== void 0 ? user.accessStatus : true,
          Validators.nullValidator,
        ],
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
          if (data) {
            this.dialogRef.close(data);
          } else {
            this.errorMsg = data.errorMessage;
          }
        });
    } else {
      requestUser.role = "guest";
      requestUser.accessStatus = "unblock";
      this._userManagementService
        .addUser(requestUser)
        .subscribe((data: any) => {
          if (data) {
            this.showSubmitButton = false;
            this.generatedAccessCode = data.data.accessCode;
            this.generateResponse = data;
          } else {
            this.errorMsg = data.errorMessage;
          }
        });
    }
  }
}
