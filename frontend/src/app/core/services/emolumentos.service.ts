import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmolumentosService {
  private apiUrl = `${environment.apiUrl}/emolumentos`;

  constructor(private http: HttpClient) {}

  getEmolumentosByCodigo(codigo: string, periodo?: string, grupPer?: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    let params: any = {};
    if (periodo) params.periodo = periodo;
    if (grupPer) params.grup_per = grupPer;

    return this.http.get(`${this.apiUrl}/${codigo}`, { headers, params });
  }
}
