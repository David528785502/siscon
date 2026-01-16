import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcesosRoutingModule } from './procesos-routing.module';
import { ActualizarDesembolsosComponent } from './actualizar-desembolsos/actualizar-desembolsos.component';
import { CesantesComponent } from './validar-descuentos/cesantes/cesantes.component';
import { ActivosComponent } from './validar-descuentos/activos/activos.component';
import { PlanillaCesantesComponent } from './descuentos-efectuados/planilla-cesantes/planilla-cesantes.component';
import { PlanillaActivosComponent } from './descuentos-efectuados/planilla-activos/planilla-activos.component';


@NgModule({
  declarations: [
    ActualizarDesembolsosComponent,
    CesantesComponent,
    ActivosComponent,
    PlanillaCesantesComponent,
    PlanillaActivosComponent
  ],
  imports: [
    CommonModule,
    ProcesosRoutingModule
  ]
})
export class ProcesosModule { }
