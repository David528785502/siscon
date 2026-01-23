import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InformacionRoutingModule } from './informacion-routing.module';
import { ConsultaPersonalComponent } from './consulta-personal/consulta-personal.component';
import { SolicitudesPrestamosComponent } from './solicitudes-prestamos/solicitudes-prestamos.component';
import { BazarComponent } from './bazar/bazar.component';
import { ReporteBazarComponent } from './reporte-bazar/reporte-bazar.component';


@NgModule({
  declarations: [
    ConsultaPersonalComponent,
    SolicitudesPrestamosComponent,
    BazarComponent,
    ReporteBazarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    InformacionRoutingModule
  ]
})
export class InformacionModule { }
