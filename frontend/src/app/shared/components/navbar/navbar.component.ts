import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class NavbarComponent implements OnInit {
  @Input() currentUser: any;
  @Output() onLogout = new EventEmitter<void>();
  
  currentModule: string = '';

  private routeTitles: { [key: string]: string } = {
    '/app/informacion/consulta-personal': 'Consulta del Personal',
    '/app/informacion/solicitudes-prestamos/consulta': 'Consulta Solicitudes',
    '/app/informacion/solicitudes-prestamos/mantenimiento': 'Mantenimiento Solicitudes',
    '/app/informacion/bazar': 'Bazar',
    '/app/informacion/reporte-bazar': 'Reporte Bazar',
    '/app/procesos/actualizar-desembolsos': 'Actualizar Desembolsos',
    '/app/procesos/validar-descuentos/cesantes': 'Validar Descuentos - Cesantes',
    '/app/procesos/validar-descuentos/activos': 'Validar Descuentos - Activos',
    '/app/procesos/descuentos-efectuados/planilla-cesantes': 'Planilla de CESANTES',
    '/app/procesos/descuentos-efectuados/planilla-activos': 'Planilla de ACTIVOS',
    '/app/reportes/consolidado-solicitudes': 'Consolidado de Solicitudes',
    '/app/verificaciones/descuentos-pensionistas': 'Descuentos Pensionistas (PEN)',
    '/app/verificaciones/descuentos-activos': 'Descuentos Activos (ACT)',
    '/app/utilidades/seguridad/usuarios': 'Usuarios',
    '/app/utilidades/seguridad/modulos': 'Módulos'
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateTitle(this.router.url);
    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateTitle(event.url);
    });
  }

  private updateTitle(url: string): void {
    this.currentModule = this.routeTitles[url] || 'Sistema de Préstamos';
  }

  logout(): void {
    this.onLogout.emit();
  }
}
