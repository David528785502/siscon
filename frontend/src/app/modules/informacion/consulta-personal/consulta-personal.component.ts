import { Component, OnInit } from '@angular/core';
import { PersonalService } from '../../../core/services/personal.service';
import { EmolumentosService } from '../../../core/services/emolumentos.service';

@Component({
  selector: 'app-consulta-personal',
  standalone: false,
  templateUrl: './consulta-personal.html',
  styleUrl: './consulta-personal.scss',
})
export class ConsultaPersonalComponent implements OnInit {
  personal: any[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  showModal: boolean = false;
  loadingModal: boolean = false;
  selectedPersona: any = null;
  periodo: string = '';
  emolumentos: any = {
    ingresos: [],
    descuentos: [],
    totalIngresos: 0,
    totalDescuentos: 0,
    totalNeto: 0
  };
  
  // Paginación
  paginaActual: number = 1;
  itemsPorPagina: number = 10;
  hayMasPaginas: boolean = false;
  totalPaginas: number = 0;
  
  meses: string[] = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  mesesCompletos: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  mostrarPeriodoSelector: boolean = false;
  
  filtros = {
    nombre: '',
    dni: '',
    mes: '',
    anio: ''
  };

  tiposContrato: { [key: string]: string } = {
    'P8': 'Nombrado',
    'P9': 'Contratado',
    'P1': 'Indeterminado',
    'P2': 'Fijo',
    'P5': 'Suplencia',
    'P3': 'Funcionarios',
    'P4': 'CAS',
    'P6': 'P.Profesional',
    'PB': 'Residente',
    'PA': 'SERUM'
  };

  constructor(
    private personalService: PersonalService,
    private emolumentosService: EmolumentosService
  ) {}

  ngOnInit(): void {
    this.calcularPeriodoAnterior();
    this.loadPersonal();
  }

  calcularPeriodoAnterior(): void {
    const hoy = new Date();
    let mes = hoy.getMonth(); // 0-11 (Enero es 0)
    let anio = hoy.getFullYear();
    
    // Mes anterior
    if (mes === 0) {
      // Si es enero, ir a diciembre del año anterior
      mes = 12;
      anio = anio - 1;
    }
    
    this.filtros.mes = this.formatMes(mes);
    this.filtros.anio = anio.toString();
  }

  formatMes(mes: number): string {
    return mes.toString().padStart(2, '0');
  }

  seleccionarMes(mes: number): void {
    this.filtros.mes = this.formatMes(mes);
    this.mostrarPeriodoSelector = false;
  }

  togglePeriodoSelector(): void {
    this.mostrarPeriodoSelector = !this.mostrarPeriodoSelector;
  }

  getNombreMes(mes: string): string {
    if (!mes) return 'Seleccione';
    const mesNum = parseInt(mes) - 1;
    return this.mesesCompletos[mesNum] || 'Seleccione';
  }

  cambiarAnio(incremento: number): void {
    const anioActual = parseInt(this.filtros.anio);
    this.filtros.anio = (anioActual + incremento).toString();
  }

  loadPersonal(): void {
    this.loading = true;
    this.errorMessage = '';

    // SIEMPRE construir periodo en formato MM-YYYY
    // Si no hay mes/año en filtros, usar el calculado por defecto
    if (!this.filtros.mes || !this.filtros.anio) {
      this.calcularPeriodoAnterior();
    }
    
    const periodo = `${this.filtros.mes}-${this.filtros.anio}`;
    console.log('Frontend - Periodo enviado:', periodo, 'Filtros:', this.filtros);

    this.personalService.getPersonal(
      this.filtros.nombre, 
      this.filtros.dni, 
      periodo,
      this.paginaActual,
      this.itemsPorPagina
    ).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.personal = response.data;
          this.hayMasPaginas = response.hayMasPaginas || false;
          this.totalPaginas = response.totalPaginas || 0;
          console.log('Registros cargados:', this.personal.length, 'Página:', this.paginaActual, 'de', this.totalPaginas);
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Error al cargar datos del personal';
        console.error('Error:', error);
      }
    });
  }

  aplicarFiltros(): void {
    this.paginaActual = 1; // Resetear a página 1 al aplicar filtros
    this.mostrarPeriodoSelector = false;
    this.loadPersonal();
  }

  limpiarFiltros(): void {
    this.filtros.nombre = '';
    this.filtros.dni = '';
    this.calcularPeriodoAnterior();
    this.paginaActual = 1;
    this.mostrarPeriodoSelector = false;
    this.loadPersonal();
  }

  // Métodos de paginación
  getRangoInicio(): number {
    return (this.paginaActual - 1) * this.itemsPorPagina + 1;
  }

  getRangoFin(): number {
    return (this.paginaActual - 1) * this.itemsPorPagina + this.personal.length;
  }

  irAPaginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.loadPersonal();
    }
  }

  irAPaginaSiguiente(): void {
    if (this.hayMasPaginas) {
      this.paginaActual++;
      this.loadPersonal();
    }
  }

  cambiarItemsPorPagina(): void {
    this.paginaActual = 1;
    this.loadPersonal();
  }

  getEstado(status: number): string {
    return status === 1 ? 'Activo' : 'Inactivo';
  }

  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-PE');
  }

  formatMoney(amount: number): string {
    if (amount === null || amount === undefined) return '0.00';
    const num = Number(amount);
    if (isNaN(num)) return '0.00';
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  calcularCapacidad(ingresoNeto: number): number {
    if (!ingresoNeto) return 0;
    return Number(ingresoNeto) * 0.40;
  }

  calcularLiquidez(ingresoNeto: number): number {
    // Temporal: por ahora igual que capacidad
    // TODO: implementar fórmula correcta con descuentos
    if (!ingresoNeto) return 0;
    return Number(ingresoNeto) * 0.40;
  }

  verDetalle(persona: any): void {
    this.selectedPersona = persona;
    this.showModal = true;
    this.loadingModal = true;

    const periodo = `${this.filtros.mes}-${this.filtros.anio}`;
    this.emolumentosService.getEmolumentosByCodigo(persona.codigo, periodo, persona.grup_per).subscribe({
      next: (response) => {
        this.loadingModal = false;
        if (response.success) {
          this.emolumentos = response.data;
          this.periodo = response.periodo;
        }
      },
      error: (error) => {
        this.loadingModal = false;
        console.error('Error al cargar emolumentos:', error);
      }
    });
  }

  cerrarModal(): void {
    this.showModal = false;
    this.selectedPersona = null;
    this.emolumentos = {
      ingresos: [],
      descuentos: [],
      totalIngresos: 0,
      totalDescuentos: 0,
      totalNeto: 0
    };
  }
}
