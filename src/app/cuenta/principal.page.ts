import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
  standalone: false,
})
export class PrincipalPage implements OnInit {
  username: string = ''; 
  nombre: string = '';
  apellido: string = '';
  nivelEducacion: string = '';
  fechaNacimiento: string = '';


  constructor(private toastController: ToastController) { }

  ngOnInit() {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this.username = storedUsername;
    } else {
      this.username = 'Invitado'; 
    }
    this.cargarInformacionCuenta();
  }

  async cargarInformacionCuenta() {
    const userInfoString = localStorage.getItem('userInfo');
    if (userInfoString) {
      try {
        const userInfo = JSON.parse(userInfoString);
        this.nombre = userInfo.nombre || '';
        this.apellido = userInfo.apellido || '';
        this.nivelEducacion = userInfo.nivelEducacion || '';
        this.fechaNacimiento = userInfo.fechaNacimiento || '';
      } catch (e) {
        console.error('Error al parsear userInfo de localStorage:', e);

        localStorage.removeItem('userInfo');
      }
    }
  }


  async guardarInformacionCuenta() {

    if (!this.nombre || !this.apellido || !this.nivelEducacion || !this.fechaNacimiento) {
      this.presentToast('Por favor, rellene todos los campos.', 'danger');
      return;
    }

    const userInfo = {
      nombre: this.nombre,
      apellido: this.apellido,
      nivelEducacion: this.nivelEducacion,
      fechaNacimiento: this.fechaNacimiento,
      username: this.username 
    };


    localStorage.setItem('userInfo', JSON.stringify(userInfo));

    this.presentToast('Información guardada correctamente.', 'success');
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
