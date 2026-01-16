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
    this.loadPersonal();
  }

  loadPersonal(): void {
    this.loading = true;
    this.errorMessage = '';

    this.personalService.getPersonal().subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.personal = response.data;
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Error al cargar datos del personal';
        console.error('Error:', error);
      }
    });
  }

  getTipoContrato(codigo: string): string {
    return this.tiposContrato[codigo] || codigo;
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

    this.emolumentosService.getEmolumentosByCodigo(persona.codigo).subscribe({
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
