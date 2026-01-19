import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LiquidezService {
  private apiUrl = 'http://localhost:3000/api/liquidez';

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
