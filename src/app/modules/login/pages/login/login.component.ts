import { Component, OnInit } from "@angular/core";
import { NavigationStart, Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  private _isAdmin = false;
  constructor(private _router: Router) {}

  ngOnInit() {
    this._isAdmin = this._router.url === "/login/admin";
    console.log(this._isAdmin);
  }
}
