import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
            
      {
        path: 'cuenta',
        loadChildren: () => import('../cuenta/principal.module').then(m => m.PrincipalPageModule)
      },

      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule )
      },
      {
        path: 'historial-ventas',
        loadChildren: () => import('../historial-ventas/historial-ventas.module').then(m => m.HistorialVentasPageModule)
      },

            {
        path: 'inventario',
        loadChildren: () => import('../inventario/inventario.module').then(m => m.InventarioPageModule)
      },

            {
        path: 'evento',
        loadChildren: () => import('../evento/evento.module').then(m => m.EventoPageModule)
      },
       {
        path: 'productoview',
        loadChildren: () => import('../productoview/productoview.module').then(m => m.ProductoviewPageModule)
      },
      {
        path: 'venta',
        loadChildren: () => import('../venta/venta.module').then(m => m.VentaPageModule)
      },




      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
