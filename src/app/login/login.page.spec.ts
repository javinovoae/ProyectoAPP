import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { IonicModule, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ApiService } from '../../app/services/api.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserLogin } from '../../app/models/usuario.model'; // Importa UserLogin

// Mocks de datos de respuesta

const mockSuccessfulLoginResponse = {
  token: 'mock-jwt-token',
  user_id: 1,
  username: 'validUser', 
};

const mockLoginError = new Error('Credenciales inválidas');

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let toastControllerSpy: jasmine.SpyObj<ToastController>;
  let loadingControllerSpy: jasmine.SpyObj<LoadingController>;
  let routerSpy: jasmine.SpyObj<Router>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;

  beforeEach(waitForAsync(() => {
    // Configuración de spies
    toastControllerSpy = jasmine.createSpyObj('ToastController', ['create']);
    loadingControllerSpy = jasmine.createSpyObj('LoadingController', ['create']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']); 
    alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);

    // **** CORRECCIÓN CLAVE AQUÍ: Tipado de ApiServiceSpy ****
    apiServiceSpy = jasmine.createSpyObj<ApiService>('ApiService', ['login']); 

    // Mock de respuestas para los controladores de Ionic
    toastControllerSpy.create.and.returnValue(Promise.resolve({
      present: () => Promise.resolve(),
      dismiss: () => Promise.resolve()
    } as any));

    loadingControllerSpy.create.and.returnValue(Promise.resolve({
      present: () => Promise.resolve(),
      dismiss: () => Promise.resolve()
    } as any));

    alertControllerSpy.create.and.returnValue(Promise.resolve({
      present: () => Promise.resolve(),
      dismiss: () => Promise.resolve()
    } as any));

    TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [
        IonicModule.forRoot(),
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule
        
      ],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: ToastController, useValue: toastControllerSpy },
        { provide: LoadingController, useValue: loadingControllerSpy },
        { provide: Router, useValue: routerSpy },
        { provide: AlertController, useValue: alertControllerSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('deberia crear el componente', () => {
    expect(component).toBeTruthy();
  });

  // Pruebas de validación de campo (movidas fuera del describe anidado si estaban dentro de un 'it')
  // **** CORRECCIÓN DE ESTRUCTURA: ESTOS 'it' DEBEN ESTAR DIRECTAMENTE EN EL 'describe('LoginPage')'
  // O en su propio 'describe' block, NO DENTRO DE OTRO 'it' ****

  it('debería establecer globalError si los campos están vacíos', async () => {
    component.username = '';
    component.password = '';

    await component.login();

    // Expectativa: que se establezca la variable globalError
    expect(component.globalError).toBe('Por favor, corrija los errores del formulario.');
    // Y que NO se llame al toastController en este caso (según tu login.page.ts)
    expect(toastControllerSpy.create).not.toHaveBeenCalled();
    expect(apiServiceSpy.login).not.toHaveBeenCalled();
  });

  it('debería mostrar error si username no cumple formato', () => {
    component.username = 'ab';
    component.validateUsername();
    expect(component.usernameError).toContain('entre 3 a 8 caracteres');
  });

  it('debería mostrar error si password está vacío', () => {
    component.password = '';
    component.validatePassword();
    expect(component.passwordError).toContain('La contraseña no puede estar vacía');
  });

  it('debería mostrar error si password no tiene 4 dígitos', () => {
    component.password = '123';
    component.validatePassword();
    expect(component.passwordError).toContain('4 dígitos');
  });

  // Pruebas de flujo de login
  describe('Flujo de Login', () => { 
    it('debería bloquear login con formulario inválido (por regex)', async () => {
      component.username = 'ab'; 
      component.password = '123'; 

      await component.login();

      expect(component.globalError).toBe('Por favor, corrija los errores del formulario.');
      expect(apiServiceSpy.login).not.toHaveBeenCalled();
      expect(toastControllerSpy.create).not.toHaveBeenCalled(); 
    });

  });
});