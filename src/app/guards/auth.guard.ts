// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service'; // Asegúrate de que esta ruta sea correcta a tu AuthService

@Injectable({
    providedIn: 'root'
    })
    export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        // 1. Pregunta al AuthService si el usuario está autenticado.
        if (this.authService.isAuthenticated()) {
        // 2. Si está autenticado, permite el acceso a la ruta.
        return true;
        } else {
        // 3. Si NO está autenticado, redirige al usuario a la página de login.
        // Asegúrate de que '/tabs/login' sea la ruta correcta a tu página de inicio de sesión.
        this.router.navigate(['/login'], { replaceUrl: true });
        // 4. Niega el acceso a la ruta actual.
        return false;
        }
    }
    }