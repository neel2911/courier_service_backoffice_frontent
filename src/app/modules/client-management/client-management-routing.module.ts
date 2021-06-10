import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddUpdateClientComponent } from "./pages/add-update-client/add-update-client.component";
import { ClientListComponent } from "./pages/client-list/client-list.component";

const routes: Routes = [
  {
    path: "",
    component: ClientListComponent,
  },
  {
    path: "add-update-client",
    component: AddUpdateClientComponent,
  },
  { path: "**", redirectTo: "/client-management", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientManagementRoutingModule {}
