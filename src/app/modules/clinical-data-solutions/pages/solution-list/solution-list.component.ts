import { Component, OnInit } from "@angular/core";
import { map } from "rxjs/operators";
import { AppService } from "src/app/services/app.service";
import { ClinicalDataSolutionsService } from "../../service/clinical-data-solutions.service";

@Component({
  selector: "app-solution-list",
  templateUrl: "./solution-list.component.html",
  styleUrls: ["./solution-list.component.scss"],
})
export class SolutionListComponent implements OnInit {
  public solutionList = [];
  public selectedFilter = "all";
  public filterList = [
    {
      title: "all",
      categoryType: "all",
    },
  ];
  constructor(
    private clinicalDataSolutionsService: ClinicalDataSolutionsService,
    private _appService: AppService
  ) {}

  ngOnInit(): void {
    this.getSolutionList();
  }

  getSolutionList() {
    this.clinicalDataSolutionsService
      .getFilters()
      .pipe(map((v) => v.data))
      .subscribe((res) => {
        console.log(res);
        this.solutionList = res;
        this._appService.solutionList = [...res];
        this.solutionList.forEach((solution) => {
          this.filterList.push({
            title: solution.title,
            categoryType: solution.categoryType,
          });
        });
      });
  }
}
