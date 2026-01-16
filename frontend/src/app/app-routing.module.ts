import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'app',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'informacion/consulta-personal',
        pathMatch: 'full'
      },
      {
        path: 'informacion',
        loadChildren: () => import('./modules/informacion/informacion.module').then(m => m.InformacionModule)
      },
      {
        path: 'procesos',
        loadChildren: () => import('./modules/procesos/procesos.module').then(m => m.ProcesosModule)
      },
      {
        path: 'reportes',
        loadChildren: () => import('./modules/reportes/reportes.module').then(m => m.ReportesModule)
      },
      {
        path: 'verificaciones',
        loadChildren: () => import('./modules/verificaciones/verificaciones.module').then(m => m.VerificacionesModule)
      },
      {
        path: 'utilidades',
        loadChildren: () => import('./modules/utilidades/utilidades.module').then(m => m.UtilidadesModule)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
