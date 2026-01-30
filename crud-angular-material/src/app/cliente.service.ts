import { Injectable } from '@angular/core';
import { Cliente } from './cadastro/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor() { }

  static REPO_CLIENTES = "_CLIENTES";

  salvar(cliente: Cliente){
    const storage = this.obterStorage();
    storage.push(cliente);
    localStorage.setItem(ClienteService.REPO_CLIENTES, JSON.stringify(storage));
  }

  pesquisarClientes(nome: string) : Cliente[] {
    return this.obterStorage();
  }
  private obterStorage(): Cliente[] {
    const rep_clientes = localStorage.getItem(ClienteService.REPO_CLIENTES);
    if(rep_clientes){
      const clientes: Cliente[] = JSON.parse(rep_clientes);
      return clientes;
    }
    const clientes: Cliente[] = []; 
    localStorage.setItem(ClienteService.REPO_CLIENTES, JSON.stringify(clientes));
    return clientes;
  }
}
