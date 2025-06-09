import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  username: string = 'Usuario'; 

  constructor(private router: Router) {}

  ngOnInit() {

        const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this.username = storedUsername;
      console.log('Usuario cargado desde localStorage:', storedUsername);
    }
  }

  goToProductos() {
    this.router.navigate(['/tabs/inventario']); 
  }

  goToEventos() {
    
    this.router.navigate(['/tabs/evento']); 
  }

  goToHistorial() {
    
    this.router.navigate(['/tabs/historial-ventas']); 
  }

  }



