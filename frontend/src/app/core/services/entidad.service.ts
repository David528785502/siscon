import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EntidadService {
  private apiUrl = 'http://localhost:3000/api/entidades';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getEntidades(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  getEntidadByCodigo(codigo: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/codigo/${codigo}`, { headers: this.getHeaders() });
  }
}
