import {ComponentFixture, TestBed} from '@angular/core/testing';

import {Public} from './public';
import {API_BASE_URL} from '../api/ApiService';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';
import {provideRouter, withEnabledBlockingInitialNavigation} from '@angular/router';

describe('Public', () => {
  let component: Public;
  let fixture: ComponentFixture<Public>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Public],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter(
          [
            // minimal routes for the template using RouterLink/RouterOutlet
            {path: '', component: Public}
          ],
          withEnabledBlockingInitialNavigation()
        ),
        {provide: API_BASE_URL, useValue: '/'}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Public);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
