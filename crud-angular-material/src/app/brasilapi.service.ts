import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Estados } from './brasilapi.models';

@Injectable({
  providedIn: 'root'
})
export class BrasilapiService {

  baseURL = 'https://brasilapi.com.br/api/';

  constructor(private http: HttpClient) { }

  listarUfs() : Observable<Estados[]>{
    const path = 'ibge/uf/v1';
    return this.http.get<Estados[]>(this.baseURL + path);
  }
}
