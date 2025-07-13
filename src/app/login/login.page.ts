import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { UserLogin, LoginResponse,UserCreate,UserProfile } from '../../app/models/usuario.model';
import { ApiService } from '../../app/services/api.service'; 


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {

username: string = ''; 
  password: string = ''; 
  usernameError: string = ''; 
  passwordError: string = ''; 
  globalError: string = '';  
  hidePassword: boolean = true; 

  constructor(
    private router: Router,
    private apiService: ApiService, 
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this.username = storedUsername;
      console.log('Usuario cargado desde localStorage:', storedUsername);
    }
  }

  validateUsername() {
    const usernameRegex = /^[a-zA-Z0-9]{3,8}$/;
    if (!this.username) {
      this.usernameError = 'El usuario no puede estar vacío.';
    } else if (!usernameRegex.test(this.username)) {
      this.usernameError = 'El usuario debe contener entre 3 a 8 caracteres de letras y/o números.';
    } else {
      this.usernameError = '';
    }
    this.globalError = ''; 
  }

  validatePassword() {
    const passwordRegex = /^[0-9]{4}$/;
    if (!this.password) {
      this.passwordError = 'La contraseña no puede estar vacía.';
    } else if (!passwordRegex.test(this.password)) {
      this.passwordError = 'La contraseña debe tener solo 4 dígitos.';
    } else {
      this.passwordError = '';
    }
    this.globalError = ''; 
  }

  // Verifica si el formulario de login es válido
  isFormValid(): boolean {
    this.validateUsername(); 
    this.validatePassword(); 
    return !this.usernameError && !this.passwordError && !!this.username && !!this.password;
  }

  // --- Método para iniciar sesión 

  async login() {
    this.validateUsername();
    this.validatePassword();

    if (this.isFormValid()) {
      const loading = await this.loadingController.create({
        message: 'Iniciando sesión',
      });
      await loading.present();

      const credentials: UserLogin = {
        username: this.username,
        password: this.password,
      };

      this.apiService.login(credentials).subscribe({
        next: async (res: LoginResponse) => {
          await loading.dismiss();
          console.log('Login exitoso:', res);
          localStorage.setItem('username', this.username); 
          localStorage.setItem('userId', res.user_id.toString()); 
          
          const toast = await this.toastController.create({
            message: `¡Bienvenido, ${res.username || this.username}!`,
            duration: 3000,
            color: 'success',
          });
          await toast.present();

          // Redirigir al usuario a la página principal
          this.router.navigate(['/tabs', 'home'], {
            queryParams: {
              username: res.username || this.username,
              userId: res.user_id 
            },
            replaceUrl: true
          });
        },
        error: async (err: any) => {
          await loading.dismiss();
          console.error('Error durante el login:', err);
          let errorMessage = err.message || 'Ocurrió un error inesperado al iniciar sesión.';

          const alert = await this.alertController.create({
            header: 'Error de Login',
            message: errorMessage,
            buttons: ['OK'],
          });
          await alert.present();
          this.globalError = errorMessage; 
        }
      });
    } else {
      this.globalError = 'Por favor, corrija los errores del formulario.';
    }
  }

  // --- Método de utilidad para la UI ---
  toggleHidePassword() {
    this.hidePassword = !this.hidePassword;
  }

    goToRegister() {
    this.router.navigate(['/tabs/registro']); 
  }


  isRegisterLinkActive(): boolean {
    return true;
  }

}





