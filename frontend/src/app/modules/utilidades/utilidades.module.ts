import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UtilidadesRoutingModule } from './utilidades-routing.module';
import { UsuariosComponent } from './seguridad/usuarios/usuarios.component';
import { ModulosComponent } from './seguridad/modulos/modulos.component';


@NgModule({
  declarations: [
    UsuariosComponent,
    ModulosComponent
  ],
  imports: [
    CommonModule,
    UtilidadesRoutingModule
  ]
})
export class UtilidadesModule { }