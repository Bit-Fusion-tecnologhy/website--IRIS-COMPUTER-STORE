import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ReviewFormModalComponent } from './review-form-modal.component';
import { AuthService } from '../../../../core/services/auth.service';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

describe('ReviewFormModalComponent', () => {
  let component: ReviewFormModalComponent;
  let fixture: ComponentFixture<ReviewFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ReviewFormModalComponent],
      providers: [
        {
          provide: AuthService,
          useValue: {
            currentUser: signal({ fullName: 'Alex Vance' }),
            isAuthenticated: true,
            logout: () => {},
            updateProfile: () => {},
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with rating 0', () => {
    expect(component.rating()).toBe(0);
  });

  it('should initialize with empty title', () => {
    expect(component.title()).toBe('');
  });

  it('should initialize with empty comment', () => {
    expect(component.comment()).toBe('');
  });

  it('should enable submit when rating and comment are valid', () => {
    component.rating.set(5);
    component.comment.set('La RTX 4090 supera todas mis expectativas.');
    fixture.detectChanges();

    expect(component.isValid()).toBeTrue();
  });

  it('should disable submit when comment is too short', () => {
    component.rating.set(5);
    component.comment.set('short');
    fixture.detectChanges();

    expect(component.isValid()).toBeFalse();
  });

  it('should show error when comment has less than 10 chars', () => {
    component.submitted.set(true);
    component.comment.set('short');
    fixture.detectChanges();

    expect(component.isValid()).toBeFalse();
  });

  it('should emit submit event when form is submitted', () => {
    component.rating.set(4);
    component.title.set('Buen producto');
    component.comment.set('La RTX 4090 supera mis expectativas.');
    fixture.detectChanges();

    let emittedData: any;
    component.submit.subscribe((data) => {
      emittedData = data;
    });

    // Manually trigger submit
    component.onSubmit();
    fixture.detectChanges();

    expect(emittedData).toBeDefined();
    if (emittedData) {
      expect(emittedData.rating).toBe(4);
      expect(emittedData.comment).toContain('RTX 4090');
    }
  });
});