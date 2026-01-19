import { Component } from '@angular/core';

@Component({
  selector: 'app-solicitudes-prestamos',
  standalone: false,
  templateUrl: './solicitudes-prestamos.html',
  styleUrl: './solicitudes-prestamos.scss',
})
export class SolicitudesPrestamosComponent {
  solicitudes: any[] = [];
  loading = false;

  constructor() {}

  ngOnInit(): void {
    // TODO: Cargar solicitudes
  }
}
