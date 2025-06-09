import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductoviewPage } from './productoview.page';

describe('ProductoviewPage', () => {
  let component: ProductoviewPage;
  let fixture: ComponentFixture<ProductoviewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductoviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
