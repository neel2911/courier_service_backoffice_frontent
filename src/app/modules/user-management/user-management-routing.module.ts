import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EmployeeListComponent } from "./pages/employee-list/employee-list.component";

const routes: Routes = [
  { path: "", component: EmployeeListComponent },
  {
    path: "**",
    redirectTo: "/user-management",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagementRoutingModule {}
