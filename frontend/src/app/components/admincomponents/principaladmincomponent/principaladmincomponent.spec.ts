import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Principaladmincomponent } from './principaladmincomponent';

describe('Principaladmincomponent', () => {
  let component: Principaladmincomponent;
  let fixture: ComponentFixture<Principaladmincomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Principaladmincomponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Principaladmincomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
