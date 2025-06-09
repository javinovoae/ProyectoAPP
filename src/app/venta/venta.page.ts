import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

interface ProductoVenta {
  nombre: string;
  costo: number;
  cantidad: number; 
  subtotal: number; 
}

@Component({
  selector: 'app-venta',
  templateUrl: './venta.page.html',
  styleUrls: ['./venta.page.scss'],
  standalone: false,
})
export class VentaPage implements OnInit {

  ventaForm!: FormGroup;
  productosParaVenta: ProductoVenta[] = [];
  nombreEvento: string = 'Evento no especificado';
  fechaEvento: string = 'Fecha no especificada';

  constructor(
    private fb: FormBuilder,
    private toastController: ToastController,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadInfoEvento();
    this.initForm();
    this.loadProductosParaVenta();
    this.calcularTotales();
  }

  loadInfoEvento() {
    const storedEvento = localStorage.getItem('eventoInfo');
    if (storedEvento) {
      const eventoInfo = JSON.parse(storedEvento);
      this.nombreEvento = eventoInfo.nombreEvento || 'Evento sin nombre';
      this.fechaEvento = eventoInfo.fechaEvento || 'Fecha sin especificar';
    } else {
      this.presentToast('No se encontró información del evento. Cree uno en la sección Eventos.', 'warning');
    }
  }

  initForm() {
    this.ventaForm = this.fb.group({
      productos: this.fb.array([]),
      montoPagado: [0, Validators.min(0)], 
      totalVenta: [{ value: 0, disabled: true }],
    });

    this.getProductosFormArray().valueChanges.subscribe(() => this.calcularTotales());
  }

  getProductosFormArray(): FormArray {
    return this.ventaForm.get('productos') as FormArray;
  }



  loadProductosParaVenta() {
    const storedProductos = localStorage.getItem('productosParaVentaDelDia');
    if (storedProductos) {
      const productosInventario = JSON.parse(storedProductos);
      if (productosInventario.length === 0) {
        this.presentToast('No hay productos seleccionados para la venta del día. Redirigiendo a selección de productos.', 'warning');
        this.router.navigate(['/inventario']);
        return;
      }
      this.productosParaVenta = productosInventario.map((p: any) => ({
        nombre: p.nombre,
        costo: p.costo,
        cantidad: 0,
        subtotal: 0
      }));

      this.productosParaVenta.forEach(producto => {
        this.getProductosFormArray().push(this.fb.group({
          nombre: [producto.nombre],
          costo: [producto.costo],
          cantidad: [0, [Validators.required, Validators.min(1)]],
          subtotal: [{ value: 0, disabled: true }]
        }));
      });
      this.calcularTotales();
    } else {
      this.presentToast('No se han cargado productos para la venta del día. Redirigiendo a selección de productos.', 'warning');
      this.router.navigate(['/seleccionar-productos']);
    }
  }

  onCantidadChange(index: number) {
    const productoControl = this.getProductosFormArray().at(index);
    const cantidad = productoControl.get('cantidad')?.value || 0;
    const costo = productoControl.get('costo')?.value || 0;
    const subtotal = cantidad * costo;

    productoControl.get('subtotal')?.setValue(subtotal);
    this.productosParaVenta[index].cantidad = cantidad;
    this.productosParaVenta[index].subtotal = subtotal;

    this.calcularTotales();
  }

  calcularTotales() {
    let total = 0;
    this.getProductosFormArray().controls.forEach(control => {
      total += control.get('subtotal')?.value || 0;
    });
    this.ventaForm.get('totalVenta')?.setValue(total);
  }


  async realizarPago() {
    const totalVenta = this.ventaForm.get('totalVenta')?.value;

    // Validar que haya al menos un producto con cantidad > 0
    const productosVendidos = this.productosParaVenta.filter(p => p.cantidad > 0);
    if (productosVendidos.length === 0) {
      this.presentToast('Debe haber al menos un producto con una cantidad mayor a cero para registrar la venta.', 'warning');
      return;
    }

    const ventaData = {
      fechaVenta: new Date().toISOString(),
      nombreEvento: this.nombreEvento,
      fechaEvento: this.fechaEvento,
      productosVendidos: productosVendidos,
      total: totalVenta,
    };

    console.log('Venta realizada:', ventaData);
    this.guardarVentaEnLocalStorage(ventaData);

    this.presentToast('¡Venta registrada con éxito!', 'success');
    this.resetVenta();
  }

  guardarVentaEnLocalStorage(venta: any) {
    let ventas = JSON.parse(localStorage.getItem('historialVentas') || '[]');
    ventas.push(venta);
    localStorage.setItem('historialVentas', JSON.stringify(ventas));
  }

  resetVenta() {
    this.ventaForm.reset({
      montoPagado: null,
      totalVenta: 0,
    });
    while (this.getProductosFormArray().length !== 0) {
      this.getProductosFormArray().removeAt(0);
    }
    this.loadProductosParaVenta();
  }

    redirigirHistorial() {
    this.router.navigate(['/tabs', 'historial-ventas']);
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