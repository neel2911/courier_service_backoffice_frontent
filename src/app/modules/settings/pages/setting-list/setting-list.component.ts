import { Component, OnInit } from "@angular/core";
import { map } from "rxjs/operators";
import { AppService } from "src/app/services/app.service";
import { SettingsService } from "../../service/settings.service";

@Component({
  selector: "app-setting-list",
  templateUrl: "./setting-list.component.html",
  styleUrls: ["./setting-list.component.scss"],
})
export class SettingListComponent implements OnInit {
  public solutionList = [];
  public selectedFilter = "all";
  public filterList = [
    {
      title: "all",
      categoryType: "all",
    },
  ];
  constructor(
    private _settingsService: SettingsService,
    private _appService: AppService
  ) {}

  ngOnInit(): void {
    this.getSolutionList();
  }

  getSolutionList() {
    this._settingsService
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
