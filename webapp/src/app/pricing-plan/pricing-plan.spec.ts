import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PricingPlan} from './pricing-plan';
import {API_BASE_URL} from '../api/ApiService';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideRouter} from '@angular/router';
import {provideHttpClient} from '@angular/common/http';

describe('PricingPlan', () => {
  let component: PricingPlan;
  let fixture: ComponentFixture<PricingPlan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricingPlan],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {provide: API_BASE_URL, useValue: 'http://localhost'}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PricingPlan);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


