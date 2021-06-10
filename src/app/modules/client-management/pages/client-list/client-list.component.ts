import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { NavigationEnd, Router } from "@angular/router";
import { map, tap } from "rxjs/operators";
import { MatNotificationService } from "src/app/modules/material/services/mat-notification.service";
import { ReactiveDatasource } from "src/app/modules/material/utils/reactive-datasource";
import { ClientManagementService } from "../../services/client-manament.service";

@Component({
  selector: "app-client-list",
  templateUrl: "./client-list.component.html",
  styleUrls: ["./client-list.component.scss"],
})
export class ClientListComponent implements OnInit, AfterViewInit {
  public currentSetting = null;
  public settingTitle = {
    roles: "Manage Roles",
    networks: "Manage Networks",
  };
  public filterText = "";
  public tableData = null;
  public selectedRowIndex = -1;
  public pageSizeOption = [5, 10, 15, 20];
  public pageIndex = 0;
  public totalRecords = 0;
  public pageSize = 5;
  public displayedColumns = [
    "clientCode",
    "clientName",
    "contactNumber",
    "createdAt",
    "createdBy",
    "updatedAt",
    "updatedBy",
    "more",
  ];
  public dataSource: ReactiveDatasource;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private _dialog: MatDialog,
    private _notification: MatNotificationService,
    private _clientManagementService: ClientManagementService,
    private _router: Router
  ) {
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log(event);
        const routeList = event.url.split("/");
        this.currentSetting = routeList[routeList.length - 1];
      }
    });
  }

  ngOnInit() {
    this.getClientList();
  }

  ngAfterViewInit() {
    this.paginator.page.pipe(tap(() => this.loadClientData())).subscribe();
  }

  public applyFilter(filterValue: string) {
    this.filterText = filterValue.trim();
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public onTableEmitter(e) {
    // switch (this.currentSetting) {
    //   case "roles":
    //     this.onUpdateRoleClick(e.data);
    //     break;
    //   case "networks":
    //     this.onUpdateNeworkClick(e.data);
    //     break;
    // }
    console.log(e);
  }

  public highlightSelectedRecord(row) {
    this.selectedRowIndex = row.accessCode;
    setTimeout(() => {
      this.selectedRowIndex = -1;
    }, 1000);
  }

  public getClientList() {
    this.dataSource = new ReactiveDatasource();
    this.loadClientData();
  }

  loadClientData() {
    this.dataSource.loadData(
      this._clientManagementService
        .getClients(this.filterText, this.pageIndex, this.pageSize)
        .pipe(
          map((val: any) => {
            return val.hasOwnProperty("data") ? val : { data: val };
          }),
          map((v) => v.data),
          map((v) => {
            this.totalRecords = v.numberOfElements;
            return v;
          })
        )
    );
  }

  public onAddClientClick() {}

  public onClientEditClick(row) {
    console.log(row);
  }
}
