import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerificacionesRoutingModule } from './verificaciones-routing.module';
import { DescuentosPensionistasComponent } from './descuentos-pensionistas/descuentos-pensionistas.component';
import { DescuentosActivosComponent } from './descuentos-activos/descuentos-activos.component';


@NgModule({
  declarations: [
    DescuentosPensionistasComponent,
    DescuentosActivosComponent
  ],
  imports: [
    CommonModule,
    VerificacionesRoutingModule
  ]
})
export class VerificacionesModule { }