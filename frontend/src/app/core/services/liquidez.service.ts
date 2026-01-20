import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LiquidezService {
  private apiUrl = `${environment.apiUrl}/liquidez`;

  constructor(private http: HttpClient) {}

  /**
   * Calcula la liquidez actual de un trabajador
   */
  calcularLiquidez(codigo: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.get(`${this.apiUrl}/${codigo}`, { headers });
  }
}
