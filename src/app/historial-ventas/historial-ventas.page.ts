import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';


interface Venta {
  fechaVenta: string;
  nombreEvento: string;
  fechaEvento: string;
  productosVendidos: { nombre: string; cantidad: number; subtotal: number }[];
  total: number;
}


@Component({
  selector: 'app-historial-ventas',
  templateUrl: './historial-ventas.page.html',
  styleUrls: ['./historial-ventas.page.scss'],
  standalone: false,
})
export class HistorialVentasPage implements OnInit {

  historialVentas: Venta[] = [];
  totalGeneralVentas: number = 0;
  nombreEvento: string = 'Evento no especificado';
  fechaEvento: string = 'Fecha no especificada';
  

  constructor(private toastController: ToastController, private router: Router) { }

  ngOnInit() {
    this.cargarHistorialVentas();
    this.calcularTotalEvento();
    this.loadInfoEvento();
  }

  cargarHistorialVentas() {
    const storedVentas = localStorage.getItem('historialVentas');
    if (storedVentas) {
      this.historialVentas = JSON.parse(storedVentas);

      this.historialVentas.sort((a, b) => {

        const dateA = new Date(a.fechaVenta).getTime();
        const dateB = new Date(b.fechaVenta).getTime();
        return dateB - dateA;
      });
    }
  }

  calcularTotalEvento() {
    this.totalGeneralVentas = this.historialVentas.reduce((acc, venta) => acc + venta.total, 0);
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
  // Método para mostrar mensajes Toast
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


  
