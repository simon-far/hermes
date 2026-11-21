import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {User} from '../../../models/usuarios.model';
import { UsuarioService } from '../../../services/usuario.service';


@Component({
  selector: 'app-usuariosadmincomponent',
  standalone: false,
  styleUrl: './usuariosadmincomponent.css',
  templateUrl: './usuariosadmincomponent.html',
})
export class Usuariosadmincomponent implements OnInit {
  private readonly usuarioService = inject(UsuarioService);

  busqueda = '';
  usuarios = signal<User[]>([]);

  totalUsuarios = computed(() => this.usuarios().length);

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.getAll().subscribe({
      next: (respuesta) => {
        this.usuarios.set(Array.isArray(respuesta) ? respuesta : []);
      },
      error: (error) => {
        console.error('Error al consultar los usuarios:', error);
      },
    });
  }

  get usuariosFiltrados(): User[] {
    const termino = this.busqueda.trim().toLowerCase();

    return this.usuarios().filter((user) =>
      user.username?.toLowerCase().includes(termino) ||
      user.email?.toLowerCase().includes(termino)
    );
  }


}
