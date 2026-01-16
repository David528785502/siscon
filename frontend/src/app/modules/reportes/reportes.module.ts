import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportesRoutingModule } from './reportes-routing.module';
import { ConsolidadoSolicitudesComponent } from './consolidado-solicitudes/consolidado-solicitudes.component';


@NgModule({
  declarations: [
    ConsolidadoSolicitudesComponent
  ],
  imports: [
    CommonModule,
    ReportesRoutingModule
  ]
})
export class ReportesModule { }