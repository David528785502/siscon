import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuariosComponent } from './seguridad/usuarios/usuarios.component';
import { ModulosComponent } from './seguridad/modulos/modulos.component';

const routes: Routes = [
  { path: 'seguridad/usuarios', component: UsuariosComponent },
  { path: 'seguridad/modulos', component: ModulosComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UtilidadesRoutingModule { }
