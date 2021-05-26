import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { first } from "rxjs/operators";
import { AppService } from "src/app/services/app.service";
@Component({
  selector: "app-left-nav-bar",
  templateUrl: "./left-nav-bar.component.html",
  styleUrls: ["./left-nav-bar.component.scss"],
})
export class LeftNavBarComponent implements OnInit {
  @Input() isDashboard: boolean = true;
  public panelState: boolean = false;
  public menuText: boolean = false;
  @Output()
  toggleLeftSidePanelStateEmmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(private _appService: AppService) {}

  ngOnInit(): void {
    this._appService.isLeftSidePanelOpen$
      .pipe(first())
      .subscribe((v: boolean) => {
        this.panelState = v;
        setTimeout(() => {
          this.menuText = this.panelState;
        }, 200);
        console.log(this.panelState);
      });
  }

  togglePanel() {
    this.panelState = !this.panelState;
    this.toggleLeftSidePanelStateEmmit.emit(this.panelState);
  }
}
