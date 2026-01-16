import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultaPersonalComponent } from './consulta-personal/consulta-personal.component';
import { SolicitudesPrestamosComponent } from './solicitudes-prestamos/solicitudes-prestamos.component';
import { BazarComponent } from './bazar/bazar.component';
import { ReporteBazarComponent } from './reporte-bazar/reporte-bazar.component';

const routes: Routes = [
  { path: 'consulta-personal', component: ConsultaPersonalComponent },
  { path: 'solicitudes-prestamos/consulta', component: SolicitudesPrestamosComponent },
  { path: 'solicitudes-prestamos/mantenimiento', component: SolicitudesPrestamosComponent },
  { path: 'bazar', component: BazarComponent },
  { path: 'reporte-bazar', component: ReporteBazarComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InformacionRoutingModule { }
