import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ApiService } from '../services/api.service'; 
import { UserProfileUpdate, UserProfile } from '../models/usuario.model';
import { Router } from '@angular/router'; 

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

userId: number | null = null; 

  constructor(
    private toastController: ToastController,
    private apiService: ApiService,
    private loadingController: LoadingController,
    private router: Router

  ) { }

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
      this.cargarInformacionCuenta(); 
    } else {
      this.username = 'Invitado';
      this.userId = null; 
      this.nombre = '';
      this.apellido = '';
      this.nivelEducacion = '';
      this.fechaNacimiento = '';
      this.presentToast('No se ha iniciado sesión. Por favor, inicie sesión.', 'warning');
      this.router.navigateByUrl('/login', { replaceUrl: true }); 
    }
  }

  async cargarInformacionCuenta() {
    if (this.userId === null) {
      console.warn('No hay ID de usuario para cargar la información del perfil. Esto no debería ocurrir si se pasó el check.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Cargando información del perfil...',
      spinner: 'lines',
    });
    await loading.present();

    this.apiService.getUserProfile(this.userId).subscribe({
      next: async (userProfile: UserProfile) => {
        await loading.dismiss();

        this.nombre = userProfile.name || ''; 
        this.apellido = userProfile.lastname || '';
        this.nivelEducacion = userProfile.education || '';
        this.fechaNacimiento = userProfile.birthdate || ''; 
        this.presentToast('Información de la cuenta cargada desde el servidor.', 'success');
      },
      error: async (err: any) => {
        await loading.dismiss();
        console.error('Error al cargar perfil desde la API:', err);

        const cachedUserProfileString = localStorage.getItem('fullUserProfile');
        if (cachedUserProfileString) {
          try {
            const cachedUserProfile: UserProfile = JSON.parse(cachedUserProfileString);
            this.nombre = cachedUserProfile.name || '';
            this.apellido = cachedUserProfile.lastname || '';
            this.nivelEducacion = cachedUserProfile.education || '';
            this.fechaNacimiento = cachedUserProfile.birthdate || '';
            this.presentToast('Información cargada desde caché (sin conexión).', 'warning');
          } catch (parseError) {
            console.error('Error al parsear el perfil de usuario desde localStorage:', parseError);
            localStorage.removeItem('fullUserProfile'); 
            this.presentToast('Error al cargar información de caché. Datos corruptos.', 'danger');
            this.nombre = '';
            this.apellido = '';
            this.nivelEducacion = '';
            this.fechaNacimiento = '';
          }
        } else {
          this.presentToast(err.message || 'Error al cargar información. No hay datos en caché.', 'danger');

          this.nombre = '';
          this.apellido = '';
          this.nivelEducacion = '';
          this.fechaNacimiento = '';
        }
      }
    });
  }


  async guardarInformacionCuenta() {

    if (this.userId === null) {
      this.presentToast('No se pudo determinar el usuario para guardar la información. Por favor, inicie sesión.', 'danger');
      this.router.navigateByUrl('/tabs/login', { replaceUrl: true });
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Guardando información del perfil...',
      spinner: 'lines',
    });
    await loading.present();

    const userData: UserProfileUpdate = {
      name: this.nombre === '' ? null : this.nombre,
      lastname: this.apellido === '' ? null : this.apellido,
      education: this.nivelEducacion === '' ? null : this.nivelEducacion,
      birthdate: this.fechaNacimiento === '' ? null : this.fechaNacimiento
    };

    this.apiService.updateUserProfile(this.userId, userData).subscribe({
      next: async (updatedProfile: UserProfile) => {
        await loading.dismiss();
        console.log('Perfil actualizado exitosamente en la API:', updatedProfile);
        this.nombre = updatedProfile.name || '';
        this.apellido = updatedProfile.lastname || '';
        this.nivelEducacion = updatedProfile.education || '';
        this.fechaNacimiento = updatedProfile.birthdate || '';
        this.presentToast('Información guardada correctamente.', 'success');
      },
      error: async (err: any) => {
        await loading.dismiss();
        console.error('Error al guardar perfil en la API:', err);
        this.presentToast(err.message || 'No se pudo guardar la información. Inténtalo de nuevo.', 'danger');
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