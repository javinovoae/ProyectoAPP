import { Component, OnInit } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular'; 
import { Router } from '@angular/router';
import { ApiService } from '../../app/services/api.service'; 
import { EventCreate }  from '../../app/models/event.model';
import { lastValueFrom } from 'rxjs'; 

@Component({
  selector: 'app-evento',
  templateUrl: './evento.page.html',
  styleUrls: ['./evento.page.scss'],
  standalone: false,
})
export class EventoPage implements OnInit {
  nombreEvento: string = '';
  fechaEvento: Date | null = null;

  constructor(
    private toastController: ToastController,
    private router: Router,
    private apiService: ApiService, 
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
  }

  async guardarInformacionEvento() {
    if (!this.nombreEvento || !this.fechaEvento) {
      this.presentToast('Por favor, rellene todos los campos.', 'danger');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Creando evento...',
    });
    await loading.present();

    //recuperar el id de la persona usando la app
    const loggedInUserIdString = localStorage.getItem('userId');
    if (!loggedInUserIdString) {
      await loading.dismiss();
      this.presentToast('Debe iniciar sesión para crear un evento.', 'danger');
      this.router.navigateByUrl('/tabs/login'); 
      return;
    }
    const loggedInUserId = parseInt(loggedInUserIdString, 10); 

    // envio a la api
    const eventData: EventCreate = {
      name: this.nombreEvento,
      event_date: this.fechaEvento.toISOString(),
      manager_id: loggedInUserId, 
    };

    // crear el evento en la api
    this.apiService.createEvent(eventData).subscribe({
      next: async (res) => {
        await loading.dismiss();
        console.log('Evento creado exitosamente:', res);
        await this.presentToast('Evento guardado correctamente.', 'success');
        this.router.navigate(['/tabs/productoview']); 
      },
      error: async (err) => {
        await loading.dismiss();
        console.error('Error al crear evento:', err);
        const errorMessage = err.message || 'No se pudo crear el evento. Inténtalo de nuevo.';
        await this.presentToast(errorMessage, 'danger');
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