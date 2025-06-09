import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

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

  isFormValid(): boolean {
    this.validateUsername();
    this.validatePassword();
    return !this.usernameError && !this.passwordError && !!this.username && !!this.password;
  }

  login() {
    this.validateUsername();
    this.validatePassword();

    if (this.isFormValid()) {
      localStorage.setItem('username', this.username);

    this.router.navigate(['/tabs', 'home'], { 
    queryParams: {
      username: this.username,
    },
    replaceUrl: true
      });
    } else {
      this.globalError = 'Por favor, corrija los errores del formulario.';
    }
  }
}






