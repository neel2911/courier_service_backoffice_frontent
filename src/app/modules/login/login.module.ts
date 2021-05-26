import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./pages/login/login.component";
import { LoginService } from "./service/login.service";
import { LoginRoutingModule } from "./login-routing.module";

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, LoginRoutingModule],
  providers: [LoginService],
})
export class LoginModule {}
