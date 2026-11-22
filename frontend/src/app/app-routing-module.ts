import {inject, NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Traductorcomponent} from './components/usercomponentes/traductorcomponent/traductorcomponent';
import {Historialcomponent} from './components/usercomponentes/historialcomponent/historialcomponent';
import {Principaladmincomponent} from './components/admincomponents/principaladmincomponent/principaladmincomponent';
import {Usuariosadmincomponent} from './components/admincomponents/usuariosadmincomponent/usuariosadmincomponent';
import {
  Solicitudesadmincomponent
} from './components/admincomponents/solicitudesadmincomponent/solicitudesadmincomponent';
import {Reportesadmincomponent} from './components/admincomponents/reportesadmincomponent/reportesadmincomponent';
import {LoginService} from './services/login.service';

const routes: Routes = [
  // Al entrar a la página (ruta raíz) se muestra directamente el traductor.
  {path: '', redirectTo: 'usuario/traductor', pathMatch: 'full'},

  {
    path: 'usuario',
    children: [{path: '', redirectTo: 'traductor', pathMatch: 'full'},
      {path: 'traductor', component: Traductorcomponent},
      {path: 'historial', component: Historialcomponent},
    ]
  },

  {
    path: 'admin',
    // Solo usuarios con sesión y rol ADMIN (la lógica está en LoginService).
    canActivate: [() => inject(LoginService).validarAccesoAdmin()],
    children: [{path: '', redirectTo: 'principaladmin', pathMatch: 'full'},
      {path: 'principaladmin', component: Principaladmincomponent},
      {path: 'usuarios', component: Usuariosadmincomponent},
      {path: 'solicitudes', component: Solicitudesadmincomponent},
      {path: 'reportes', component: Reportesadmincomponent},
    ]
  },

  // Cualquier dirección que no exista lleva al traductor en lugar de mostrar la página vacía.
  // Debe ir siempre al final: Angular revisa las rutas en orden.
  {path: '**', redirectTo: 'usuario/traductor'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
