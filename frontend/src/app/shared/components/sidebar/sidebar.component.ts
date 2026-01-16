import { Component } from '@angular/core';

interface MenuItem {
  label: string;
  route?: string;
  icon?: string;
  children?: MenuItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent {
  menuItems: MenuItem[] = [
    {
      label: 'Información',
      icon: 'info',
      expanded: true,
      children: [
        { label: 'Consulta del Personal', route: '/app/informacion/consulta-personal' },
        { label: 'Solicitudes Préstamos', route: '/app/informacion/solicitudes-prestamos' },
        { label: 'Bazar', route: '/app/informacion/bazar' },
        { label: 'Reporte Bazar', route: '/app/informacion/reporte-bazar' }
      ]
    },
    {
      label: 'Procesos',
      icon: 'settings',
      expanded: false,
      children: [
        { label: 'Actualizar Desembolsos', route: '/app/procesos/actualizar-desembolsos' },
        {
          label: 'Validar Descuentos',
          children: [
            { label: 'Cesantes', route: '/app/procesos/validar-descuentos/cesantes' },
            { label: 'Activos', route: '/app/procesos/validar-descuentos/activos' }
          ]
        },
        {
          label: 'Descuentos Efectuados',
          children: [
            { label: 'Planilla de CESANTES', route: '/app/procesos/descuentos-efectuados/planilla-cesantes' },
            { label: 'Planilla de ACTIVOS', route: '/app/procesos/descuentos-efectuados/planilla-activos' }
          ]
        }
      ]
    },
    {
      label: 'Reportes',
      icon: 'description',
      expanded: false,
      children: [
        { label: 'Consolidado de Solicitudes', route: '/app/reportes/consolidado-solicitudes' }
      ]
    },
    {
      label: 'Verificaciones',
      icon: 'verified',
      expanded: false,
      children: [
        { label: 'Descuentos Pensionistas (PEN)', route: '/app/verificaciones/descuentos-pensionistas' },
        { label: 'Descuentos Activos (ACT)', route: '/app/verificaciones/descuentos-activos' }
      ]
    },
    {
      label: 'Utilidades',
      icon: 'build',
      expanded: false,
      children: [
        {
          label: 'Seguridad',
          children: [
            { label: 'Usuarios', route: '/app/utilidades/seguridad/usuarios' },
            { label: 'Módulos', route: '/app/utilidades/seguridad/modulos' }
          ]
        }
      ]
    }
  ];

  toggleMenu(item: MenuItem): void {
    item.expanded = !item.expanded;
  }
}
