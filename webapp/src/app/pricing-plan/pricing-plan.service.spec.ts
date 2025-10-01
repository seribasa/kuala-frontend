import {TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {PricingPlanService} from './pricing-plan.service';
import {API_BASE_URL, ApiService} from '../api/ApiService';
import {provideHttpClient} from '@angular/common/http';

describe('PricingPlanService', () => {
  let pricingPlanService: PricingPlanService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: '/' },
        ApiService,
        PricingPlanService
      ],
    });

    pricingPlanService = TestBed.inject(PricingPlanService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should fetch the list of subscription plans from the API', (done) => {
    const mockPlans = [
      {id: 1, name: 'Plan A', price: 10},
      {id: 2, name: 'Plan B', price: 20},
    ];

    pricingPlanService.listSubscriptionPlans().then((plans) => {
      expect(plans).toEqual(mockPlans);
      done();
    });

    const req = httpTestingController.expectOne('/plans');
    expect(req.request.method).toBe('GET');
    req.flush(mockPlans);
  });
});
