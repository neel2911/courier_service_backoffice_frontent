import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-add-update-client",
  templateUrl: "./add-update-client.component.html",
  styleUrls: ["./add-update-client.component.scss"],
})
export class AddUpdateClientComponent implements OnInit {
  public clientData = null;
  public clientForm: FormGroup;
  constructor(public formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.clientForm = this.formBuilder.group(
      {
        clientCode: [this.clientData?.clientCode || "", [Validators.required]],
        name: [this.clientData?.name || "", [Validators.required]],
        contactNumber: [
          this.clientData?.contactNumber || "",
          [
            Validators.required,
            Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
          ],
        ],
        address: [this.clientData?.address || "", Validators.required],
        description: [this.clientData?.description || "", Validators.required],
        status: [this.clientData?.status || false, Validators.nullValidator],
        emailIds: this.formBuilder.array(
          this.clientData?.emailIds?.length > 0
            ? this.clientData?.emailIds.map((v) => {
                return this.formBuilder.group({
                  emailIdLabel: [
                    v.emailIdLabel,
                    [Validators.required, Validators.email],
                  ],
                  emailId: [v.emailId, [Validators.required, Validators.email]],
                });
              })
            : [
                this.formBuilder.group({
                  emailIdLabel: ["", [Validators.required, Validators.email]],
                  emailId: ["", [Validators.required, Validators.email]],
                }),
              ]
        ),
        clientNetwork: [
          this.clientData?.clientNetwork || "",
          Validators.required,
        ],
        hasCustomRate: [
          this.clientData?.customrate || false,
          Validators.required,
        ],
      },
      { updateOn: "blur" }
    );
    console.log(this.clientForm);
  }

  addEmail() {
    (this.clientForm.get("emailIds") as FormArray).push(
      this.formBuilder.group({
        emailIdLabel: ["", [Validators.required, Validators.email]],
        emailId: ["", [Validators.required, Validators.email]],
      })
    );
  }

  removeEmail(index) {
    (this.clientForm.get("emailIds") as FormArray).removeAt(index);
  }
}
