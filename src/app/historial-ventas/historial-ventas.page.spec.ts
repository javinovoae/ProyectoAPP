import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialVentasPage } from './historial-ventas.page';
import { CommonModule } from '@angular/common'; 
import { IonicModule } from '@ionic/angular';


describe('HistorialVentasPage', () => {
  let component: HistorialVentasPage;
  let fixture: ComponentFixture<HistorialVentasPage>;

  beforeEach(async () => { 
    await TestBed.configureTestingModule({
      declarations: [HistorialVentasPage],
      imports: [
        CommonModule, 
        IonicModule.forRoot() 
      ]
    }).compileComponents(); 

    fixture = TestBed.createComponent(HistorialVentasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
