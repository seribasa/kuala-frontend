import {ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {PricingPlan} from './pricing-plan';
import {Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {PricingPlanService} from './pricing-plan.service';
import {Public} from '../public';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {API_BASE_URL} from '../../api/ApiService';

// Introduce types to avoid `any` in tests
type Price = { currency: 'USD' | string; amount: number };
type RawPlan = { name?: string; prices: Price[] };
type PlansResponse = {
  monthly?: { plans: RawPlan[] };
  annually?: { plans: RawPlan[] };
};

describe('PricingPlan', () => {
  let component: PricingPlan;
  let fixture: ComponentFixture<PricingPlan>;
  let mockPricingPlanService: jasmine.SpyObj<PricingPlanService>;
  let mockRouter: jasmine.SpyObj<Router>;

  // Extracted helpers
  const buildPlansResponse = (monthly?: RawPlan[], annually?: RawPlan[]): PlansResponse => ({
    monthly: monthly ? {plans: monthly} : undefined,
    annually: annually ? {plans: annually} : undefined,
  });

  const createComponent = async () => {
    await TestBed.configureTestingModule({
      imports: [MatButtonModule, PricingPlan],
      providers: [
        {provide: PricingPlanService, useValue: mockPricingPlanService},
        {provide: Router, useValue: mockRouter},
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(PricingPlan);
    component = fixture.componentInstance;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Public],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {provide: API_BASE_URL, useValue: '/'}
      ]
    }).compileComponents();

    mockPricingPlanService = jasmine.createSpyObj<PricingPlanService>('PricingPlanService', ['listSubscriptionPlans']);
    mockRouter = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);
    await createComponent();
    fixture.detectChanges();
  });

  it('should initialize and load subscription plans on init', fakeAsync(() => {
    const mockResponse = buildPlansResponse(
      [{prices: [{currency: 'USD', amount: 10}]}],
      [{prices: [{currency: 'USD', amount: 100}]}],
    );
    mockPricingPlanService.listSubscriptionPlans.and.returnValue(Promise.resolve(mockResponse));
    component.ngOnInit();
    tick(); // resolve promise
    expect(mockPricingPlanService.listSubscriptionPlans).toHaveBeenCalled();
  }));

  it('should handle failed subscription plan loading', fakeAsync(() => {
    mockPricingPlanService.listSubscriptionPlans.and.returnValue(Promise.reject('Error'));
    spyOn(console, 'error');
    component.ngOnInit();
    tick(); // let catch run
    expect(console.error).toHaveBeenCalledWith('Failed to load month subscription plans', 'Error');
    expect(console.error).toHaveBeenCalledWith('Failed to load year subscription plans', 'Error');
    expect(console.error).toHaveBeenCalledTimes(2);
  }));

  it('should switch billing cycle and return correct displayed plans', () => {
    component.billingCycle = 'monthly';
    component.monthlyPlans = [{name: 'Basic Plan', price: '$10'} as any];
    component.annualPlans = [{name: 'Premium Plan', price: '$100'} as any];
    expect(component.displayedPlans()).toEqual([{name: 'Basic Plan', price: '$10'}]);
    // Use the correct union value used across component: 'yearly' switches to annual plans
    component.setBillingCycle('yearly');
    expect(component.displayedPlans()).toEqual([{name: 'Premium Plan', price: '$100'}]);
  });

  it('should format plans with USD prices correctly', fakeAsync(() => {
    const mockResponse = [{prices: [{currency: 'USD', amount: 20}]}];
    mockPricingPlanService.listSubscriptionPlans.and.returnValue(Promise.resolve(mockResponse));
    component.loadSubscriptionPlans('month').then(result => {
      component.monthlyPlans = result;
    });
    tick(); // resolve promise and mapping
    expect(component.monthlyPlans).toEqual([{
      prices: [{currency: 'USD', amount: 20}],
      price: '$20',
      usdAmount: 20
    } as any]);
  }));
});
