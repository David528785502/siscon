import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DescuentosPensionistasComponent } from './descuentos-pensionistas/descuentos-pensionistas.component';
import { DescuentosActivosComponent } from './descuentos-activos/descuentos-activos.component';

const routes: Routes = [
  { path: 'descuentos-pensionistas', component: DescuentosPensionistasComponent },
  { path: 'descuentos-activos', component: DescuentosActivosComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerificacionesRoutingModule { }
