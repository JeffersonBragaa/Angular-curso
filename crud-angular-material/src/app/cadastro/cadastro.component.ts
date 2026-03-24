import { Component, OnInit, Inject, inject} from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, NgForm } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import { MatFormFieldModule} from "@angular/material/form-field"; 
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { Cliente } from './cliente';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { query } from '@angular/animations';
import { NgxMaskDirective, provideNgxMask} from 'ngx-mask';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrasilapiService } from '../brasilapi.service';
import { Estados, Municipios } from '../brasilapi.models';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { Subscriber } from 'rxjs';


@Component({
  selector: 'app-cadastro',
  imports: [FlexLayoutModule, 
    MatCardModule, 
    FormsModule, 
    MatFormFieldModule,
    MatInputModule, 
    MatIconModule, 
    MatButtonModule, 
    NgxMaskDirective, 
    MatSelectModule, 
    CommonModule
  ],providers: [
    provideNgxMask()
  ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent implements OnInit{
  cliente: Cliente = Cliente.newCliente();
  atualizando: boolean = false;
  snack: MatSnackBar = inject(MatSnackBar);
  estados: Estados[] = [];  
  municipios: Municipios[] = [];  

  constructor(
    private service: ClienteService,
    private brasilapiService: BrasilapiService, 
    private route: ActivatedRoute, 
    private router: Router
  ){

  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe( (query: any) => {
      const params = query['params']
      const id = params['id']

      if(id){
        let clienteEncontrado = this.service.buscarClienteId(id); 
        if(clienteEncontrado){
          this.atualizando = true;
          this.cliente = clienteEncontrado;
          if(this.cliente.uf){
            const event = {value: this.cliente.uf}
            this.carregarMunicipios(event as MatSelectChange)
          }
        }
      }
    })
    this.carregarUFs();
  }
  carregarUFs(){
    this.brasilapiService.listarUfs().subscribe({
      next: listaEstados => this.estados = listaEstados,
      error: err => console.log("erro ao listar estados", err)
    })
  }

  carregarMunicipios(event: MatSelectChange){
    const ufSelecionada = event.value;
    this.brasilapiService.listarMunicipios(ufSelecionada).subscribe({
      next: listarMunicipio => this.municipios = listarMunicipio,
      error: erro => console.log("Ocorreu um erro: ", erro)
    })
  }
  salvar(){
    if(!this.atualizando){
      this.service.salvar(this.cliente);
      this.limparFormulario()  
      this.mostrar_msg('Cliente cadastrado com sucesso!')
    } else {
      this.service.atualizar(this.cliente);
      this.router.navigate(['/consulta'])
      this.mostrar_msg('Cliente atualizado com sucesso!')
    }
  }

  limpar(form?: NgForm){
    form?.resetForm();
    this.cliente = Cliente.newCliente();
  }

  limparFormulario(){
    this.cliente = Cliente.newCliente()
  }

  mostrar_msg(msg: string){
    this.snack.open(msg, 'Ok', {
      duration: 3000
    })
  }
}
