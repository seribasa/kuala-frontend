import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {Subscriptions} from './subscriptions';
import {SubscriptionsService} from './subscriptions.service';

describe('Subscriptions', () => {
  let component: Subscriptions;
  let fixture: ComponentFixture<Subscriptions>;
  let mockSubscriptionsService: jasmine.SpyObj<SubscriptionsService>;

  beforeEach(async () => {
    mockSubscriptionsService = jasmine.createSpyObj<SubscriptionsService>('SubscriptionsService', [
      'listPlans',
      'getSubscription',
    ]);

    mockSubscriptionsService.listPlans.and.returnValue(Promise.resolve([]));
    mockSubscriptionsService.getSubscription.and.returnValue(Promise.resolve(null));

    await TestBed.configureTestingModule({
      imports: [Subscriptions],
      providers: [
        {provide: SubscriptionsService, useValue: mockSubscriptionsService},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Subscriptions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', fakeAsync(() => {
    tick();
    expect(component).toBeTruthy();
  }));
});
