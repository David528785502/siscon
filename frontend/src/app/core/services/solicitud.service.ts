import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
  private apiUrl = `${environment.apiUrl}/solicitudes`;

  constructor(private http: HttpClient) {}

  /**
   * Guarda múltiples solicitudes en la base de datos
   */
  guardarSolicitudes(solicitudes: any[], codigoEntidad: string, nombreEntidad: string, fechaSolicitud: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.post(this.apiUrl, {
      solicitudes,
      codigoEntidad,
      nombreEntidad,
      fechaSolicitud
    }, { headers });
  }

  /**
   * Obtiene todas las solicitudes desde la base de datos
   */
  obtenerSolicitudes(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.get(this.apiUrl, { headers });
  }
}
