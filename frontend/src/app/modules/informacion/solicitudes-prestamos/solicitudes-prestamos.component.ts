import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EntidadService } from '../../../core/services/entidad.service';
import { LiquidezService } from '../../../core/services/liquidez.service';
import { SolicitudService } from '../../../core/services/solicitud.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-solicitudes-prestamos',
  standalone: false,
  templateUrl: './solicitudes-prestamos.html',
  styleUrl: './solicitudes-prestamos.scss',
})
export class SolicitudesPrestamosComponent {
  solicitudes: any[] = [];
  loading = false;

  // Importar archivo
  archivoSeleccionado: File | null = null;
  nombreArchivo: string = '';
  formatoValido: boolean = false;
  errorFormato: string = '';
  codigoEntidad: string = '';
  nombreEntidad: string = '';
  fechaSolicitud: string = '';
  mostrarValidacion: boolean = false;

  // Modal de importación
  mostrarModalImportacion: boolean = false;
  solicitudesImportadas: any[] = [];
  fechaSolicitudFormateada: string = '';
  guardando: boolean = false;
  
  // Mensajes
  mensajeExito: string = '';
  mensajeError: string = '';
  detalleErrores: any[] = [];

  constructor(
    private router: Router, 
    private entidadService: EntidadService,
    private liquidezService: LiquidezService,
    private solicitudService: SolicitudService
  ) {}

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  cargarSolicitudes(): void {
    this.loading = true;
    this.solicitudService.obtenerSolicitudes().subscribe({
      next: (response) => {
        if (response.success) {
          this.solicitudes = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar solicitudes:', error);
        this.loading = false;
      }
    });
  }

  isMantenimiento(): boolean {
    return this.router.url.includes('mantenimiento');
  }

  abrirSelectorArchivo(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.procesarArchivo(file);
      }
    };
    input.click();
  }

  procesarArchivo(file: File): void {
    this.archivoSeleccionado = file;
    const nombreSinExtension = file.name.replace('.txt', '');
    this.nombreArchivo = file.name;
    this.validarFormatoNombre(nombreSinExtension);
  }

  validarFormatoNombre(nombre: string): void {
    // Formato: codigo_entidad_ddmmyyyy
    // Ejemplo: 155_23072012
    const regex = /^(\d{3})_(\d{2})(\d{2})(\d{4})$/;
    const match = nombre.match(regex);

    if (!match) {
      this.formatoValido = false;
      this.errorFormato = 'Formato incorrecto. Debe ser: codigo_ddmmyyyy (ej: 155_23072012)';
      this.mostrarValidacion = true;
      return;
    }

    const [_, codigo, dia, mes, anio] = match;
    this.codigoEntidad = codigo;

    // Validar fecha
    const fecha = new Date(parseInt(anio), parseInt(mes) - 1, parseInt(dia));
    if (isNaN(fecha.getTime()) || 
        fecha.getDate() !== parseInt(dia) || 
        fecha.getMonth() !== parseInt(mes) - 1 || 
        fecha.getFullYear() !== parseInt(anio)) {
      this.formatoValido = false;
      this.errorFormato = 'Fecha inválida en el nombre del archivo';
      this.mostrarValidacion = true;
      return;
    }

    this.fechaSolicitud = new Date().toLocaleDateString('es-PE');
    this.fechaSolicitudFormateada = `${dia}/${mes}/${anio}`;
    this.formatoValido = true;
    this.errorFormato = '';
    this.mostrarValidacion = true;

    // TODO: Buscar nombre de entidad en la base de datos
    this.buscarEntidad(codigo);
  }

  buscarEntidad(codigo: string): void {
    this.entidadService.getEntidadByCodigo(codigo).subscribe({
      next: (entidad) => {
        if (entidad) {
          this.nombreEntidad = entidad.nombre_entidad;
        } else {
          this.nombreEntidad = '';
          this.formatoValido = false;
          this.errorFormato = `Entidad con código ${codigo} no encontrada`;
        }
      },
      error: (error) => {
        console.error('Error al buscar entidad:', error);
        this.nombreEntidad = '';
        this.formatoValido = false;
        this.errorFormato = `Entidad con código ${codigo} no encontrada`;
      }
    });
  }

  cerrarValidacion(): void {
    this.mostrarValidacion = false;
    this.archivoSeleccionado = null;
    this.nombreArchivo = '';
    this.formatoValido = false;
    this.errorFormato = '';
    this.codigoEntidad = '';
    this.nombreEntidad = '';
    this.fechaSolicitudFormateada = '';
  }

  procesarImportacion(): void {
    if (!this.formatoValido || !this.archivoSeleccionado) return;
    
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const contenido = e.target.result;
      this.parsearContenidoArchivo(contenido);
      this.calcularLiquidezTrabajadores();
      this.mostrarValidacion = false;
      this.mostrarModalImportacion = true;
    };
    reader.readAsText(this.archivoSeleccionado);
  }

  parsearContenidoArchivo(contenido: string): void {
    const lineas = contenido.split('\n').filter(linea => linea.trim() !== '');
    this.solicitudesImportadas = [];

    lineas.forEach((linea, index) => {
      // Formato: 4086702PACORA              BAZALAR             VIVIANA ROSARIO       13000.0036  467.002
      // código(7) + nombres(variable con espacios) + monto.00 + plazo(2) + espacios + cuota.00 + tipo(1)
      const regex = /^(\d{7})(.+)\s+(\d+\.\d{2})(\d{2})\s+(\d+\.\d{2})(\d)\s*$/;
      const match = linea.match(regex);

      if (!match) {
        console.error('Línea con formato inválido:', linea);
        return;
      }

      const [_, codigo, nombreCompleto, montoStr, plazoStr, cuotaStr, tipoStr] = match;
      
      const monto = parseFloat(montoStr);
      const plazo = parseInt(plazoStr);
      const cuota = parseFloat(cuotaStr);
      const tipo = parseInt(tipoStr);

      this.solicitudesImportadas.push({
        numero: index + 1,
        codigo: '1' + codigo.trim(), // Agregar "1" al inicio del código, quizas lo se cambie el formato, RECORDAR
        nombreCompleto: nombreCompleto.trim(),
        monto,
        plazo,
        cuota,
        tipo,
        liquidez: null,
        estado: '',
        observacion: ''
      });
    });
  }

  calcularLiquidezTrabajadores(): void {
    // Crear array de observables para consultar liquidez de cada trabajador
    const liquidezObservables = this.solicitudesImportadas.map(solicitud => 
      this.liquidezService.calcularLiquidez(solicitud.codigo)
    );

    // Ejecutar todas las consultas en paralelo
    forkJoin(liquidezObservables).subscribe({
      next: (resultados: any[]) => {
        resultados.forEach((resultado, index) => {
          const solicitud = this.solicitudesImportadas[index];
          
          if (resultado.existe) {
            // Usar liquidez calculada en el backend con el algoritmo completo
            const liquidez = resultado.liquidez || 0;
            
            solicitud.liquidez = parseFloat(liquidez.toFixed(2));
            
            // Determinar estado y observación según la liquidez vs cuota
            if (liquidez === 0) {
              // Rechazado: sin liquidez
              solicitud.estado = 'R';
              solicitud.observacion = 'No tiene liquidez disponible';
            } else if (liquidez < solicitud.cuota) {
              // Parcial: liquidez menor a la cuota solicitada
              solicitud.estado = 'P';
              solicitud.observacion = `Solicitó cuota de S/ ${solicitud.cuota.toFixed(2)} pero solo tiene capacidad para S/ ${liquidez.toFixed(2)}`;
            } else {
              // Aprobado: liquidez mayor o igual a la cuota
              solicitud.estado = 'A';
              solicitud.observacion = '';
            }
          } else {
            // Trabajador no existe
            solicitud.liquidez = null;
            solicitud.estado = '-';
            solicitud.observacion = resultado.mensaje;
          }
        });
      },
      error: (error) => {
        console.error('Error al calcular liquidez:', error);
        // En caso de error, marcar todos como sin liquidez
        this.solicitudesImportadas.forEach(solicitud => {
          solicitud.liquidez = null;
          solicitud.estado = '-';
          solicitud.observacion = 'Error al calcular liquidez';
        });
      }
    });
  }

  cerrarModalImportacion(): void {
    this.mostrarModalImportacion = false;
    this.solicitudesImportadas = [];
    this.guardando = false;
    this.mensajeExito = '';
    this.mensajeError = '';
    this.detalleErrores = [];
    this.cerrarValidacion();
  }

  guardarSolicitudes(): void {
    if (this.guardando) return;

    this.guardando = true;

    this.solicitudService.guardarSolicitudes(
      this.solicitudesImportadas,
      this.codigoEntidad,
      this.fechaSolicitud
    ).subscribe({
      next: (response) => {
        this.guardando = false;
        
        if (response.success) {
          const tieneErrores = response.data.errores > 0;
          
          if (tieneErrores) {
            this.mensajeError = `No se pudo guardar. ${response.data.errores} solicitudes ya están registradas.`;
          } else {
            this.mensajeExito = `${response.data.guardadas} solicitudes guardadas correctamente.`;
            setTimeout(() => {
              this.cerrarModalImportacion();
              this.cargarSolicitudes();
            }, 2000);
          }
        } else {
          this.mensajeError = response.message;
        }
      },
      error: (error) => {
        this.guardando = false;
        console.error('Error al guardar solicitudes:', error);
        this.mensajeError = 'Error al conectar con el servidor.';
      }
    });
  }
}
