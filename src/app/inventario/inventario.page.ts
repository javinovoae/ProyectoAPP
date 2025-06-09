import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

interface Producto {
  nombre: string;
  costo: number;
}

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
  standalone: false,
})
export class InventarioPage implements OnInit {

  nombreProducto: string = '';
  costoProducto: number | null = null; 
  
  productosGuardados: Producto[] = [];

  constructor( private toastController: ToastController) {}

  ngOnInit() {
    this.loadProductos(); 
  }

  loadProductos() {
    const storedProductos = localStorage.getItem('productosInventario');
    if (storedProductos) {
      this.productosGuardados = JSON.parse(storedProductos);
    }
  }

  // Guardar un nuevo producto
  async guardarProducto() {
    if (!this.nombreProducto || this.costoProducto === null || this.costoProducto < 0) {
      this.presentToast('Por favor, ingrese un nombre y un costo válido para el producto.', 'danger');
      return;
    }

    const nuevoProducto: Producto = {
      nombre: this.nombreProducto,
      costo: this.costoProducto
    };

    // Agregar el nuevo producto al array y guardarlo en localStorage
    this.productosGuardados.push(nuevoProducto);
    localStorage.setItem('productosInventario', JSON.stringify(this.productosGuardados));

    this.presentToast('Producto guardado correctamente.', 'success');

    // Limpiar los campos del formulario
    this.nombreProducto = '';
    this.costoProducto = null;
  }

  // Eliminar un producto 
  async eliminarProducto(index: number) {
    this.productosGuardados.splice(index, 1); // Elimina el producto del array
    localStorage.setItem('productosInventario', JSON.stringify(this.productosGuardados)); // Actualiza localStorage
    this.presentToast('Producto eliminado.', 'warning');
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
