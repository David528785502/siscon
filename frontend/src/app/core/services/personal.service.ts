import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonalService {
  private apiUrl = `${environment.apiUrl}/personal`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getPersonal(nombre?: string, dni?: string, periodo?: string, pagina: number = 1, itemsPorPagina: number = 10): Observable<any> {
    let params: any = {
      pagina: pagina.toString(),
      limite: itemsPorPagina.toString()
    };
    if (nombre) params.nombre = nombre;
    if (dni) params.dni = dni;
    // Periodo siempre debe estar presente
    if (periodo) params.periodo = periodo;
    
    console.log('Servicio - Parámetros enviados:', params);
    
    return this.http.get(this.apiUrl, { 
      headers: this.getHeaders(),
      params: params
    });
  }
}
