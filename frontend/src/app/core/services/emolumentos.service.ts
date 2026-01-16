import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmolumentosService {
  private apiUrl = 'http://localhost:3000/api/emolumentos';

  constructor(private http: HttpClient) {}

  getEmolumentosByCodigo(codigo: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/${codigo}`, { headers });
  }
}
