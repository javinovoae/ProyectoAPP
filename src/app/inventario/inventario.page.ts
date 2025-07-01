import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ApiService } from '../services/api.service'; 
import { Product, ProductCreate } from '../models/product.model';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
  standalone: false,
})
export class InventarioPage implements OnInit {

  username: string = 'Invitado';
  userId: number | null = null;
  
  nombreProducto: string = '';
  costoProducto: number | null = null; 

  productosGuardados: Product[] = [];

  constructor(
    private toastController: ToastController,
    private apiService: ApiService,
    private router: Router 
  ) {}

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.checkAndLoadUser();
  }

  private checkAndLoadUser() {
    const storedUsername = localStorage.getItem('username');
    const storedUserIdString = localStorage.getItem('userId'); 

    if (storedUsername && storedUserIdString) {
      this.username = storedUsername;
      this.userId = parseInt(storedUserIdString, 10);
      this.loadProductos(); 
      
    } else {
      this.username = 'Invitado';
      this.userId = null; 
      this.presentToast('No se ha iniciado sesión. Por favor, inicie sesión.', 'warning');
      this.router.navigateByUrl('/login', { replaceUrl: true }); 
    }
  }

  loadProductos() {
    this.apiService.getProductos(this.userId as number).subscribe({
      next: (data) => {
        this.productosGuardados = data;
      },
      error: (err: HttpErrorResponse) => { // Tipado de error
        console.error('Error al cargar productos:', err);
        // Ajustado para usar la lógica de tu handleError centralizado
        const errorMessage = err.error?.detail || err.message || 'Desconocido';
        this.presentToast('Error al cargar productos: ' + errorMessage, 'danger');
      }
    });
  }

  async guardarProducto() {
    if (!this.nombreProducto || this.costoProducto === null || this.costoProducto <= 0) {
      this.presentToast('Por favor, ingrese un nombre y un costo válido (mayor a 0) para el producto.', 'danger');
      return;
    }
    
    if (this.userId === null) {
      this.presentToast('Error: Usuario no identificado para guardar el producto.', 'danger');
      return;
    }

    const nuevoProducto: ProductCreate = {
      name: this.nombreProducto,
      price: this.costoProducto,
      user_id: this.userId 
    };

  
    this.apiService.createProducto(nuevoProducto).subscribe({
      next: (productoCreado) => {
        this.productosGuardados.push(productoCreado);
        this.presentToast('Producto guardado correctamente.', 'success');
        this.nombreProducto = '';
        this.costoProducto = null;
      },
      error: (err: HttpErrorResponse) => { // Tipado de error
        console.error('Error al guardar producto:', err);
        const errorMessage = err.error?.detail || err.message || 'Error al guardar el producto.';
        this.presentToast(errorMessage, 'danger');
      }
    });
  }

  async eliminarProducto(id: number | undefined) {
    if (id === undefined) {
      this.presentToast('Error: ID de producto no encontrado para eliminar.', 'danger');
      return;
    }

    if (this.userId === null) {
      this.presentToast('Error: Usuario no identificado para eliminar el producto.', 'danger');
      return;
    }


    this.apiService.deleteProducto(id).subscribe({
      next: () => {
        this.productosGuardados = this.productosGuardados.filter(p => p.id !== id);
        this.presentToast('Producto eliminado.', 'warning');
      },
      error: (err: HttpErrorResponse) => { // Tipado de error
        console.error('Error al eliminar producto:', err);
        const errorMessage = err.error?.detail || err.message || 'Error al eliminar el producto.';
        this.presentToast(errorMessage, 'danger');
      }
    });
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