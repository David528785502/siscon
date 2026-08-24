import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
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
  selectedPersonaDetalle: any = null;
  cuentaHaberes: any = null;
  cuentaCts: any = null;
  fotoFallida: boolean = false;
  periodo: string = '';
  boletaTipoActual: string = '';
  tabActivo: string = 'datos'; // 'datos' o 'remuneracion'
  emolumentos: any = {
    ingresos: [],
    descuentos: [],
    totalIngresos: 0,
    totalDescuentos: 0,
    totalNeto: 0
  };
  
  historialBoletas: any[] = [];
  cargandoHistorial: boolean = false;

  // Clasificación de conceptos para capacidad de endeudamiento
  conceptos = {
    ingresosPermanentes: [
      '9200', // Rem Basica
      '9201', // Rem Personal
      '9202', // Rem Reunificada
      '9220', // Remuneración D.L. 1057
      '9204', // Aum. afiliados AFP 3%
      '9205', // Rem Transit Pension
      '9206', // Asign Movilidad
      '9207', // Asign Refrigerio
      '9208', // Bon familiar D.L. 276
      '9209', // Bonificación
      '9219', // Bonif Zona Menor Desarr
      '9244', // Asign Familiar D.L 728
      '9221', // Dif Encargo Plaza Bonif
      '9223', // Dif Encargo Plaza Rem
      '9214', // Sentencia Jud. Rem
      '9216', // Sentencia Jud. Bonif
      '9218', // Asign Familiar D.L. 276
      '9234', //Exon Guardias Med>50 años
      '9249', // Remuneacion
      '9274'  // Bono Tecnologo Medico
    ] as string[],
    
    ingresosOtros: [
      '9260', // Horas extras 25%
      '9261', // Horas extras 35%
      '9236', // Guardia Retenes
      '9237', // Guardias
      '9239'  // Horas Extras ProgEspecial
    ] as string[], // Se toman al 50%
    
    descuentosLey: [
      '8015', // D Ap.Oblig. AFP Integra
      '8007', // D Com.Porcen. AFP Integra
      '8008', // D Seguros AFP Integra
      '8009', // D Ap.Oblig. AFP Prima
      '8011', // D Com.Porcen. AFP Prima
      '8012', // D Seguros AFP Prima
      '8019', // D Retención Judicial 1
      '8020', // D Retención Judicial 2
      '8021', // D Retención Judicial 3
      '8022', // D Retención Judicial 4
      '8013', // D Ap.Oblig. AFP Profuturo
      '8015', // D Com.Porcen. AFP Profuturo
      '8016', // D Seguros AFP Profuturo
      '8017', // D Sist. Nac. Pensiones
      '8023', // D Ap.Oblig. AFP Habitat
      '8025', // D Com.Porcen. AFP Habitat
      '8026', // D Seguros AFP Habitat
      '8018', // D Imp. Renta 5ta. Categ
      '8032', // D Retención Judicial 5
      '8033'  // D Retención Judicial 6

    ] as string[],

    descuentosJudiciales: [
      '8019', // D Retención Judicial 1
      '8020', // D Retención Judicial 2
      '8021', // D Retención Judicial 3
      '8022', // D Retención Judicial 4
      '8090', // D Ret Jud. Deuda 3ero 1
      '8091'  // D Ret Jud. Deuda 3ero 2
    ] as string[],

    descuentosInstitucionales: [
      '8034', // D Dscto Días Inactivos
      '8035', // D Fondo de Pens D.L.20530
      '8039', // D Renta de 4ta
      '8040', // D. Besfa-BER Fed. CUT
      '8046', // Descuento cobro en exceso
      '8047', // Prestaciones médicas
      '8058', // D Min. Tardanza
      '8059', // D Dscto Días Inact No Rem
      '8068', // D Per Par/Movilidad
      '8069', // D Per Par/Refrigerio
      '8072', // D Falta
      '8073', // D Per.Motivo Particular D
      '8074', // D Per.Motivo Particular M
      '8075', // D Suspensión Disciplin.
      '8079', // D Per Par/AumAfAFP 10.23%
      '8080', // D Per Par/Rem Única

      '8081', // D Per Par/Bonif
      '8082', // D Per Par/Dif EncPlazaBon
      '8083', // D Per Par/Dif EncPlazaRem
      '8085', // D Per Par/Rem Básica
      '8087', // D Per Par/Rem Personal
      '8088', // D Dscto Ausen No Rem
      '8090', // D Ret Jud. Deuda 3ero 1
      '8091', // D Ret Jud. Deuda 3ero 2
      '8094', // D Per Par/Rem Reunificada
      '8095', // D Per Par/Aum Af AFP 3%
      '8096', // D Per Par/Rem Trans Pens
      '8097', // D Per Par/Bon famil 276
      '8098', // D Per Par/Sent. Judic Rem
      '8101', // D. Seguro +Vida

      '8206', // D Asign Movilidad
      '8207', // D Asign Refrigerio
      '8209', // D Bonificación
      '8210', // D Bono Productividad
      '8211', // Bono Prest Econ Alta Resp
      '8212', // D Bono Especialidad
      '8215', // D Escolaridad
      '8217', // D Bonif por vacaciones
      '8219', // D Bonif Zona Menor Desarr
      '8221', // D Dif Encargo Plaza Bonif
      '8223', // D Dif Encargo Plaza Rem
      '8224', // D CTS Semestral
      '8226', // D Faltas
      '8228', // D Permiso Particular

      '8229', // D Subs. Gastos de Sepelio
      '8233', // D Domingos y feriados
      '8234', // D Exon Guard Méd >50 años
      '8237', // D Guardias
      '8238', // D Gratificación Julio-Dic
      '8239', // D Horas Extras ProgEsp.
      '8243', // D RPCT-CAS
      '8244', // D Asig. Familiar D.L 728
      '8249', // D Remuneración Única
      '8250', // D PCT
      '8260', // D Horas extras 25%
      '8261', // D Horas extras 35%
      '8265', // D Subsidio
      '8274', // D Bono Tecnólogo Médico
      '8293'  // D Bono Extraor. COVID
    ] as string[],

    descuentosSindicales: [
            '8301', // D Asoc Médica peruana
      '8302', // D Asoc de Enfermeras
      '8303', // D Aport F.I.A. Enfer HNERM
      '8304', // D Asoc NacMed SegSocObre
      '8305', // D Asoc Obstet Rebag./Areq
      '8307', // D Asoc Psiquiatras HNGAI
      '8308', // D Famenssalud
      '8309', // D Asoc Tecnólogos médicos
      '8310', // D Asoc. De Obstetrices
      '8311', // D Asoc. ASEIPSS
      '8312', // D Asoc ExEmp Seg.SocP.
      '8313', // D CFTESSALUD
      '8339', // D Cuerpo Médico
      '8340', // D C.Méd Yanahuara (Areq)
      '8342', // D C.Méd HNCASE / Cusco
      '8358', // D Seguro Médico Familiar
      '8359', // D Col de Médico
      '8360', // D Col Tecnólogos médicos
      '8361', // D Col de Obstetrices
      '8362', // D Col de Nutricionistas
      '8363', // D Col de Enfermeras
      '8364', // D Col de psicólogos
      '8373', // D Col de Odontólogos
      '8380', // D Sindicato SUTAD
      '8388', // D SINABIOSSS – EsSalud
      '8389', // D Federación CUT
      '8391', // D Sind. de Psicólogos
      '8393', // D Cuota Extraord. Siness
      '8394', // D Sind. Unitario Biólogos
      '8395', // Sind. NacTecn Méd EsSalud
      '8396', // D Sind. Único Nut EsSalud
      '8397', // Dscto CUT - Bases OO.DD.
      '8398', // D Cut Nacional
      '8399', // Sind. Enferm HN Sur/Rebag
      '8400', // D Cuota Extra Fed. CUT
      '8401', // D Sind.Nac.de Trab.Social
      '8402', // D Sind.Nac.de Obstetrices
      '8403', // D Sind.Nac.Enfermeras
      '8404', // D SUTAESSALUD
      '8405', // D SUCUT Almenara/Trujillo
      '8406', // D Cuota ext. Cut nacional
      '8407', // SINAMSSOP

      '8440', // D SINMPTEAP
      '8464', // Federación Mixta CUT
      '8465', // Cuota Extr. Fed. Mixta CUT
      '8473', // SINCHOFAD
      '8477', // D CTP
      '8479', // D SGPADM
      '8484', // C.E. Sin. Único Nut Essal
      '8487', // D Sindicato CFT IPSS
      '8488', // D C.E. CFT IPSS
      '8495'  // D SINAMES
    ] as string[],

    descuentosTerceros: [      
      '8102', // D Banco Continental
      '8106', // D Banco GNB
      '8107', // D Banco Inter. Finanzas
      '8108', // D Banco Interbank
      '8109', // D Banco Scotiabank
      '8111', // D Banco De Comercio
      '8112', // D Caja Municipal Arequipa
      '8116', // D Caja Municipal Cusco
      '8120', // D Caja Municipal Tacna
      '8121', // D Caja Municipal Trujillo
      '8123', // D Caja Piura
      '8124', // D Caja Rural
      '8126', // D Centrocoop
      '8128', // D Coop 2 de Mayo – Piura
      '8130', // D Coop Ah/Créd Ilo
      '8134', // D Coop Ah/Créd Sta Catal.
      '8139', // D Coop El Dorado
      '8141', // D Coop Juan Pablo
      '8144', // D Coop San Jorge
      '8148', // D Coop Sto Domingo Guzman
      '8150', // D Coop-3
      '8151', // D Coopsertra

      '8498', // D Caja Municipal Maynas
      '8499', // D Rímac Seguros
      '8500', // D Cooperativa El Tumi
      '8501', // D Coop. La Rehabilitadora
      '8504', // D Coop. Volcán Cia. Miner
      '8505'  // D Coop. Santo Cristo
    ] as string[]
  };

  // Cálculos de capacidad
  capacidad = {
    ingresosPermanentes: 0,
    ingresosOtros: 0,
    descuentosLey: 0,
    descuentosJudiciales: 0,
    descuentosInstitucionales: 0,
    descuentosSindicales: 0,
    ingreso: 0,
    capacidadEndeudamiento: 0,
    descuentosTerceros: 0,
    solicitudTramite: 0,
    liquidez: 0
  };
  
  // Paginación
  paginaActual: number = 1;
  itemsPorPagina: number = 10;
  hayMasPaginas: boolean = false;
  totalPaginas: number = 0;
  
  filtros = {
    nombre: '',
    dni: '',
    codigo: ''
  };

  // SAP Style Search
  tipoBusqueda: string = '1'; // '1'=nombres, '2'=codigo, '3'=dni
  terminoBusqueda: string = '';
  personaSeleccionadaIndex: number = -1;

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
    'PA': 'SERUM',
    
    '2': '728',
    '3': '728',
    '4': 'CAS',
    '5': 'CAS',
    '6': '276',
    '7': '276',
    '8': 'PRACTICANTE',
    '9': '276',
    'E': 'CAS COVID',
    'F': 'CAS EMERG.'
  };

  tiposDocumento: any = {
    '01': 'DNI',
    '04': 'CARNÉ EXT.',
    '07': 'PASAPORTE',
  };

  constructor(
    private personalService: PersonalService,
    private emolumentosService: EmolumentosService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.loadPersonal();
  }

  loadPersonal(): void {
    this.loading = true;
    this.errorMessage = '';

    const periodo = ''; // Ya no se usa periodo para busqueda de personal
    console.log('Frontend - Filtros:', this.filtros);

    this.personalService.getPersonal(
      this.filtros.nombre, 
      this.filtros.dni, 
      this.filtros.codigo,
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
    // Mapear término de búsqueda a los filtros reales
    this.filtros.nombre = '';
    this.filtros.dni = '';
    this.filtros.codigo = '';
    
    if (this.terminoBusqueda) {
      if (this.tipoBusqueda === '1') {
        this.filtros.nombre = this.terminoBusqueda;
      } else if (this.tipoBusqueda === '3') {
        this.filtros.dni = this.terminoBusqueda;
      } else if (this.tipoBusqueda === '2') {
        this.filtros.codigo = this.terminoBusqueda;
      }
    }

    this.paginaActual = 1;
    this.personaSeleccionadaIndex = -1; // Reset selection
    this.selectedPersona = null;
    this.loadPersonal();
  }

  limpiarFiltros(): void {
    this.terminoBusqueda = '';
    this.filtros.nombre = '';
    this.filtros.dni = '';
    this.filtros.codigo = '';
    this.paginaActual = 1;
    this.personaSeleccionadaIndex = -1;
    this.selectedPersona = null;
    this.loadPersonal();
  }

  seleccionarEnGrilla(persona: any, index: number): void {
    this.selectedPersona = persona;
    this.personaSeleccionadaIndex = index;
    this.fotoFallida = false; // Reiniciar estado de foto
    this.historialBoletas = [];
    this.cargandoHistorial = true;

    this.emolumentosService.getHistorial(persona.codigo, persona.grup_per).subscribe({
      next: (res) => {
        if (res.success) {
          this.historialBoletas = res.data;
        }
        this.cargandoHistorial = false;
      },
      error: (err) => {
        console.error('Error cargando historial', err);
        this.cargandoHistorial = false;
      }
    });
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

  getEstado(status: any): string {
    return status == 3 ? 'Activo' : 'Inactivo';
  }

  formatDate(date: string): string {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  getFotoUrl(codigo: string | undefined): string {
    if (!codigo || codigo.length < 2) return 'assets/no-photo.png';
    const numStr = codigo.substring(1);
    return `http://10.0.1.98/fotos/fotos/${numStr}.jpg`;
  }

  onFotoError(event: any): void {
    this.fotoFallida = true;
  }

  getRegimenPensiones(afp: string | null | undefined): string {
    if (!afp) return '';
    if (afp === 'SNP' || afp === 'ONP') return afp;
    return 'AFP';
  }

  getAfpName(afp: string | null | undefined): string {
    if (!afp) return '';
    if (afp === 'SNP' || afp === 'ONP') return '';
    return afp;
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

  // Ya no se necesita cargarEmolumentosTabla ni calcularValoresPersona para la grilla padre

  calcularCapacidadEndeudamiento(): void {
    const ingresosSeguros = this.emolumentos?.ingresos || [];
    const descuentosSeguros = this.emolumentos?.descuentos || [];

    // Clasificar ingresos permanentes (al 100%)
    const ingresosPermanentes100 = ingresosSeguros
      .filter((ing: any) => this.conceptos.ingresosPermanentes.includes(ing.concepto))
      .reduce((sum: number, ing: any) => sum + parseFloat(ing.importe || 0), 0);
    
    // Clasificar ingresos otros (al 50%)
    const ingresosOtros50 = ingresosSeguros
      .filter((ing: any) => this.conceptos.ingresosOtros.includes(ing.concepto))
      .reduce((sum: number, ing: any) => sum + (parseFloat(ing.importe || 0) * 0.5), 0);
    
    // Fórmula: Ingresos Permanentes = [INGR. PER] + 50% [INGR. OTR]
    this.capacidad.ingresosPermanentes = ingresosPermanentes100 + ingresosOtros50;
    this.capacidad.ingresosOtros = ingresosOtros50;

    // Clasificar descuentos
    this.capacidad.descuentosLey = descuentosSeguros
      .filter((desc: any) => this.conceptos.descuentosLey.includes(desc.concepto))
      .reduce((sum: number, desc: any) => sum + parseFloat(desc.importe || 0), 0);

    this.capacidad.descuentosJudiciales = descuentosSeguros
      .filter((desc: any) => this.conceptos.descuentosJudiciales.includes(desc.concepto))
      .reduce((sum: number, desc: any) => sum + parseFloat(desc.importe || 0), 0);

    this.capacidad.descuentosInstitucionales = descuentosSeguros
      .filter((desc: any) => this.conceptos.descuentosInstitucionales.includes(desc.concepto))
      .reduce((sum: number, desc: any) => sum + parseFloat(desc.importe || 0), 0);

    this.capacidad.descuentosSindicales = descuentosSeguros
      .filter((desc: any) => this.conceptos.descuentosSindicales.includes(desc.concepto))
      .reduce((sum: number, desc: any) => sum + parseFloat(desc.importe || 0), 0);

    this.capacidad.descuentosTerceros = descuentosSeguros
      .filter((desc: any) => this.conceptos.descuentosTerceros.includes(desc.concepto))
      .reduce((sum: number, desc: any) => sum + parseFloat(desc.importe || 0), 0);

    // solicitudTramite se obtendrá del valor de la cuota del préstamo (no de emolumentos)
    this.capacidad.solicitudTramite = 0; // RECORDAR: Obtener de la cuota del préstamo - Aun no funcionando

    // Cálculo de Ingreso
    this.capacidad.ingreso = this.capacidad.ingresosPermanentes 
      - this.capacidad.descuentosLey 
      - this.capacidad.descuentosJudiciales 
      - this.capacidad.descuentosInstitucionales 
      - this.capacidad.descuentosSindicales;

    // Algoritmo de Capacidad de Endeudamiento
    // 1. Capacidad 40% del ingreso
    const capacidad40 = this.capacidad.ingreso * 0.40;

    // 2. Capacidad de Endeudamiento = (Ingreso Permanente - Descuento de Ley) * 50%
    const capacidadEndeudamiento50 = (this.capacidad.ingresosPermanentes - this.capacidad.descuentosLey) * 0.50;

    // 3. Variable temporal para comparación
    const variableTemporal = capacidad40 + this.capacidad.descuentosJudiciales + this.capacidad.descuentosSindicales;

    // 4. Determinar capacidad final según comparación
    if (variableTemporal > capacidadEndeudamiento50) {
      // Capacidad final = Capacidad Endeudamiento 50% - desc. judiciales - desc. sindicales
      this.capacidad.capacidadEndeudamiento = capacidadEndeudamiento50 
        - this.capacidad.descuentosJudiciales 
        - this.capacidad.descuentosSindicales;
    } else {
      // Capacidad final = 40% del ingreso
      this.capacidad.capacidadEndeudamiento = capacidad40;
    }

    // 5. Cálculo de Liquidez = Capacidad final - Descuentos de Terceros
    this.capacidad.liquidez = this.capacidad.capacidadEndeudamiento - this.capacidad.descuentosTerceros;
    
    // 6. Si liquidez < 0, igual a 0
    if (this.capacidad.liquidez < 0) {
      this.capacidad.liquidez = 0;
    }
  }

  verJudiciales(boleta: any): void {
    console.log('Ver Judiciales para boleta:', boleta);
    alert('Funcionalidad de Judiciales en construcción');
  }

  verDetalle(persona: any, boletaPeriodo?: string, boletaTipo?: string): void {
    this.selectedPersona = persona;
    this.boletaTipoActual = boletaTipo || '';
    this.periodo = boletaPeriodo || '';
    this.showModal = true;
    this.fotoFallida = false; // Reiniciar estado de foto

    this.loadingModal = true;
    this.tabActivo = 'datos';

    const periodo = boletaPeriodo || '';
    
    this.emolumentosService.getEmolumentosByCodigo(persona.codigo, periodo, persona.grup_per).subscribe({
      next: (response) => {
        this.loadingModal = false;
        if (response.success) {
          this.emolumentos = response.data;
          this.periodo = response.periodo || boletaPeriodo || '';
          this.selectedPersonaDetalle = response.data.personalDetalle || null;
          this.cuentaHaberes = response.data.cuentaHaberes || null;
          this.cuentaCts = response.data.cuentaCts || null;
          this.calcularCapacidadEndeudamiento();
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
    this.periodo = '';
    this.selectedPersonaDetalle = null;
    this.cuentaHaberes = null;
    this.cuentaCts = null;
    this.tabActivo = 'datos';
    this.boletaTipoActual = '';
    this.emolumentos = {
      ingresos: [],
      descuentos: [],
      totalIngresos: 0,
      totalDescuentos: 0,
      totalNeto: 0
    };
  }
}