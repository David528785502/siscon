import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActualizarDesembolsosComponent } from './actualizar-desembolsos/actualizar-desembolsos.component';
import { CesantesComponent } from './validar-descuentos/cesantes/cesantes.component';
import { ActivosComponent } from './validar-descuentos/activos/activos.component';
import { PlanillaCesantesComponent } from './descuentos-efectuados/planilla-cesantes/planilla-cesantes.component';
import { PlanillaActivosComponent } from './descuentos-efectuados/planilla-activos/planilla-activos.component';

const routes: Routes = [
  { path: 'actualizar-desembolsos', component: ActualizarDesembolsosComponent },
  { path: 'validar-descuentos/cesantes', component: CesantesComponent },
  { path: 'validar-descuentos/activos', component: ActivosComponent },
  { path: 'descuentos-efectuados/planilla-cesantes', component: PlanillaCesantesComponent },
  { path: 'descuentos-efectuados/planilla-activos', component: PlanillaActivosComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcesosRoutingModule { }
