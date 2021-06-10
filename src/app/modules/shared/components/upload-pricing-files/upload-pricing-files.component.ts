import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as Excel from "exceljs/dist/exceljs.js";

@Component({
  selector: "app-upload-pricing-files",
  templateUrl: "./upload-pricing-files.component.html",
  styleUrls: ["./upload-pricing-files.component.scss"],
})
export class UploadPricingFilesComponent implements OnInit {
  public pricingForm: FormGroup;
  public isExcelLoaded: boolean = false;
  public isFileLoading: boolean = false;
  public selectedFiles: any;
  public sheetData: any;
  public fileType: string = "pricePerItem";
  constructor(public formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.pricingForm = this.formBuilder.group(
      {
        name: ["", [Validators.required]],
        status: [false, Validators.nullValidator],
      },
      { updateOn: "blur" }
    );
  }

  removeFile() {
    this.isExcelLoaded = false;
    this.selectedFiles = [];
    this.sheetData = [];
  }

  onFileInputStart(e) {
    this.isFileLoading = true;
  }

  onFileRead(files) {
    this.isFileLoading = false;
    // this.dataTabGroup.selectedIndex = 0;
    if (files && files[0].isValidFileType) {
      this.readFile(files[0])
        .then((res: any) => {
          this.isExcelLoaded = true;
          console.log(res);
          this.selectedFiles = [...files];
          this.sheetData = [...res];
          // if (files[0].isCsv) {
          //   this.creatAnalysisForm.controls.selectedSheet.setValue({
          //     ...this.sheetData[0],
          //   });
          //   this.columns = [
          //     ...this.creatAnalysisForm.value.selectedSheet.columns,
          //   ];
          // }
          // this.showToastMessage("File loaded sucsessfully.", "success");
        })
        .catch((error) => {
          // this.showToastMessage(error, "error");
        });
    } else {
      // this.showToastMessage(
      //   files[0].isValidFileType === false &&
      //     `Please select .xlsx, .csv file only`,
      //   "error"
      // );
    }
  }

  readFile(file) {
    return new Promise((resolve, reject) => {
      const headerValues = [];
      const dataValues = [];
      let nodata = true;
      const wb = new Excel.Workbook();
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result;
        wb.xlsx
          .load(result)
          .then((workbook) => {
            workbook.eachSheet((sheet, id) => {
              const headers = [];

              // sheet
              // .getRows(2, sheet.actualRowCount - 1)
              // .forEach((v) => console.log(v.values));

              if (sheet.actualRowCount > 1) {
                if (sheet.getRow(1).cellCount > 1) {
                  sheet.getRows(2, sheet.actualRowCount - 1).forEach((v) => {
                    // console.log(
                    const tempValue = [];
                    v.eachCell((cell, cellId) => {
                      console.log(cell.value);
                      tempValue.push(cell.value);
                      // headers.push({
                      //   countryName:
                      // })
                    });

                    console.log(sheet);
                    if (this.fileType == "pricePerItem") {
                      for (let i = 1; i < tempValue.length; i++) {
                        headers.push({
                          itemName: tempValue[0],
                          charges: tempValue[i],
                          zoneCode: sheet.getRow(1).getCell(i + 1).value,
                        });
                      }
                    } else {
                      headers.push({
                        countryName: tempValue[0],
                        zoneCode: tempValue[1],
                      });
                    }

                    // )
                  });
                }
                if (headers.length > 0) {
                  headerValues.push({
                    id,
                    sheetData: sheet.name,
                    columns: [...headers],
                  });
                  nodata = headerValues.length > 0 ? false : true;
                }
              } else {
              }
            });
          })
          .then(() => {
            nodata
              ? reject("There is no data in selected file")
              : resolve(headerValues);
          });
      };
      reader.readAsArrayBuffer(file.file);
    });
  }
}
