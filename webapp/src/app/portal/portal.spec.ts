import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Portal } from './portal';
import {Public} from '../public/public';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {API_BASE_URL} from '../api/ApiService';
import {provideRouter, withEnabledBlockingInitialNavigation} from '@angular/router';

describe('Portal', () => {
  let component: Portal;
  let fixture: ComponentFixture<Portal>;

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

    fixture = TestBed.createComponent(Portal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
