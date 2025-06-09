import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

interface Producto {
  nombre: string;
  costo: number;
}

@Component({
  selector: 'app-productoview',
  templateUrl: './productoview.page.html',
  styleUrls: ['./productoview.page.scss'],
  standalone: false,
})
export class ProductoviewPage implements OnInit {

  productosInventario: Producto[] = [];

  constructor( private router: Router,
    private toastController: ToastController) { }

  ngOnInit() {
  this.loadProductosFromInventario();
  }

    loadProductosFromInventario() {
    const storedProductos = localStorage.getItem('productosInventario');
    if (storedProductos) {
      this.productosInventario = JSON.parse(storedProductos);
      if (this.productosInventario.length === 0) {
        this.presentToast('No hay productos en inventario. Por favor, agregue algunos.', 'warning');
        this.router.navigate(['/tabs', 'inventario']);
      }
    } else {
      this.presentToast('No hay productos en inventario. Por favor, agregue algunos.', 'warning');
      this.router.navigate(['/tabs', 'inventario']);
    }
  }

  // Función para redirigir al inventario si se desea editar o añadir
  redirigirAInventario() {
    this.router.navigate(['/tabs', 'inventario']);
  }

  aceptarProductos() {
    if (this.productosInventario.length === 0) {
      this.presentToast('No hay productos para aceptar. Por favor, añada algunos en el inventario.', 'danger');
      return;
    }

    //ventas del dia
    localStorage.setItem('productosParaVentaDelDia', JSON.stringify(this.productosInventario));
    this.presentToast('Productos listos para comenzar las ventas!', 'success');

    this.router.navigate(['/tabs','venta']);
  }

  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    toast.present();
  }

}
