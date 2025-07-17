import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { UserLogin, LoginResponse } from '../../app/models/usuario.model';
import { ApiService } from '../../app/services/api.service';
import { AuthService } from '../../app/services/auth.service'; 



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {

  username: string = ''; 
  password: string = ''; 
  globalError: string = '';  
  hidePassword: boolean = true; 

  constructor(
    private router: Router,
    private apiService: ApiService, 
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.username = this.authService.getUsername() || '';
      console.log('Usuario cargado desde localStorage (vía AuthService):', this.username);
      // Opcional: Redirigir si ya está logueado, aunque PublicGuard lo haría:
      // this.router.navigate(['/tabs', 'home'], { replaceUrl: true });
    }
  }


  isFormValid(): boolean {
    return !!this.username && !!this.password;
  }

  async login() {
    if (!this.isFormValid()) {
      this.globalError = 'Por favor, complete todos los campos.';
      return;
    }

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

        // --- INICIO DE LA MODIFICACIÓN CRUCIAL ---
        let errorMessage = 'Ocurrió un error inesperado al iniciar sesión.'; // Mensaje por defecto

        if (err && typeof err === 'object') {
            // 1. **PRIORIDAD:** Intentar obtener el mensaje de la carga útil del error del servidor (err.error.message)
            if (err.error && typeof err.error === 'object' && err.error.message) {
                errorMessage = err.error.message;
            }
            // 2. Si err.error es un string (algunos backends devuelven el error como un string JSON o plano)
            else if (err.error && typeof err.error === 'string') {
                try {
                    const parsedError = JSON.parse(err.error);
                    if (parsedError.message) {
                        errorMessage = parsedError.message;
                    } else {
                        errorMessage = err.error; // Usar el string completo si no hay 'message' dentro
                    }
                } catch (e) {
                    errorMessage = err.error; // No es JSON, usar el string plano
                }
            }
            // 3. Último recurso: Usar el mensaje general de la HttpErrorResponse (ej: "Http failure response for...")
            else if (err.message) {
                errorMessage = err.message;
            }
        }
        // --- FIN DE LA MODIFICACIÓN CRUCIAL ---

        const alert = await this.alertController.create({
          header: 'Error de Login',
          message: errorMessage, // ¡Ahora esto debería contener 'Credenciales inválidas'!
          buttons: ['OK'],
        });
        await alert.present();
        this.globalError = errorMessage;
      }
    });
  }

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