import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-evento',
  templateUrl: './evento.page.html',
  styleUrls: ['./evento.page.scss'],
  standalone: false,

})
export class EventoPage implements OnInit {
  nombreEvento: string = ''; 
  fechaEvento: string = ''; 
  
  
  constructor(private toastController: ToastController, private router: Router) { }


  ngOnInit() {
  }

  async guardarInformacionEvento() {

    if (!this.nombreEvento || !this.fechaEvento) {
      this.presentToast('Por favor, rellene todos los campos.', 'danger');
      return;
    }

    const eventoInfo = {
      nombreEvento : this.nombreEvento ,
      fechaEvento : this.fechaEvento

    };

    localStorage.setItem('eventoInfo', JSON.stringify(eventoInfo));

    this.presentToast('Información guardada correctamente.', 'success');

    this.router.navigate(['/tabs/productoview']);
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
