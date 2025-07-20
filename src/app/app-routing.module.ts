import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'; // Importa AuthGuard

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'tabs', 
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'principal', 
    loadChildren: () => import('./cuenta/principal.module').then( m => m.PrincipalPageModule),
    canActivate: [AuthGuard]
  },

  {
    path: '',
    redirectTo: 'login', 
    pathMatch: 'full'
  },

  {
    path: '**', 
    loadChildren: () => import('./pages/not-found/not-found.module').then(m => m.NotFoundPageModule)
    // Opcional: Si quieres que cualquier ruta no encontrada te redirija directamente al login:
    // redirectTo: 'login',
    // pathMatch: 'full'
  },

  // RUTAS QUE ERAN INDIVIDUALES PERO DEBERÍAN ESTAR BAJO TABS (ej: home, evento, inventario)
  // Si estas páginas se acceden *solo* a través de /tabs/home, /tabs/evento, etc.
  // ENTONCES, PUEDES ELIMINAR ESTAS DEFINICIONES DE AQUÍ (app-routing.module.ts)
  // ya que la definición de 'tabs' como padre con canActivate ya las protege.
  // Si todavía necesitas acceder a ellas directamente como /home, /evento, etc.
  // Y quieres que estén protegidas, mantenlas aquí con canActivate: [AuthGuard].
  // Dado que tu tabs-routing ya las tiene, es probable que estas sean redundantes aquí
  // y la intención sea accederlas vía /tabs/*.
  // Revisa tu archivo src/app/tabs/tabs.page.html para ver cómo están tus ion-tab-button.
  // Normalmente, los ion-tab-button apuntan a las rutas hijas de /tabs (ej. tab="/tabs/home").
  /*
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule), canActivate: [AuthGuard] },
  { path: 'evento', loadChildren: () => import('./evento/evento.module').then( m => m.EventoPageModule), canActivate: [AuthGuard] },
  { path: 'inventario', loadChildren: () => import('./inventario/inventario.module').then( m => m.InventarioPageModule), canActivate: [AuthGuard] },
  { path: 'productoview/:id', loadChildren: () => import('./productoview/productoview.module').then( m => m.ProductoviewPageModule), canActivate: [AuthGuard] },
  { path: 'venta', loadChildren: () => import('./venta/venta.module').then( m => m.VentaPageModule), canActivate: [AuthGuard] },
  { path: 'historial-ventas', loadChildren: () => import('./historial-ventas/historial-ventas.module').then( m => m.HistorialVentasPageModule), canActivate: [AuthGuard] },
  */
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}