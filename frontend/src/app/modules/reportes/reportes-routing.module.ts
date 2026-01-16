import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsolidadoSolicitudesComponent } from './consolidado-solicitudes/consolidado-solicitudes.component';

const routes: Routes = [
  { path: 'consolidado-solicitudes', component: ConsolidadoSolicitudesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }
