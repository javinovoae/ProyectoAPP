// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router'; 

    @Injectable({
    providedIn: 'root' 
    })
    export class AuthService {

    constructor(private router: Router) { } 

    login(username: string, userId: number): void { // <-- ¡ESTA ES LA FUNCIÓN QUE TE FALTA O NO ESTÁ BIEN DEFINIDA!
        localStorage.setItem('username', username);
        localStorage.setItem('userId', userId.toString()); // Guarda el ID como string
    }
        


    logout(): void {
        // Eliminamos toda la información de sesión
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        localStorage.removeItem('fullUserProfile'); // Es importante limpiar el perfil en caché también al cerrar sesión

        // Redirigimos al usuario a la página de login
        this.router.navigateByUrl('/login', { replaceUrl: true });
    }

    /**
     * Verifica si el usuario está actualmente autenticado.
     * Consideramos que un usuario está autenticado si tenemos su 'username' y 'userId' en localStorage.
     * @returns `true` si el usuario está autenticado, `false` en caso contrario.
     */
    isAuthenticated(): boolean {
        const username = localStorage.getItem('username');
        const userId = localStorage.getItem('userId');
        // Retorna true solo si ambos existen
        return !!username && !!userId;
    }

    /**
     * Obtiene el ID del usuario autenticado.
     * @returns El ID del usuario como número, o `null` si no hay sesión iniciada.
     */
    getUserId(): number | null {
        const userIdString = localStorage.getItem('userId');
        return userIdString ? parseInt(userIdString, 10) : null;
    }

    /**
     * Obtiene el nombre de usuario autenticado.
     * @returns El nombre de usuario, o `null` si no hay sesión iniciada.
     */
    getUsername(): string | null {
        return localStorage.getItem('username');
    }

    
    }