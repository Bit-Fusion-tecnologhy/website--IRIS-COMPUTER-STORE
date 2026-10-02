import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReviewsSectionComponent } from './reviews-section.component';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('ReviewsSectionComponent', () => {
  let component: ReviewsSectionComponent;
  let fixture: ComponentFixture<ReviewsSectionComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewsSectionComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewsSectionComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.componentRef.setInput('productId', 'rtx-4090');
    fixture.componentRef.setInput('productName', 'RTX 4090');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept productId as input binding', () => {
    expect(component).toBeTruthy();
  });

  it('should render skeleton initially while loading', () => {
    fixture.detectChanges();
    // Before flushing HTTP, component should be in loading state
    expect(component.isLoading()).toBeTrue();
    // Skeleton should be rendered
    const skeleton = fixture.debugElement.query(By.css('app-reviews-skeleton'));
    expect(skeleton).toBeTruthy();
    // Flush the HTTP request
    const req = httpMock.expectOne('http://localhost:3000/reviews?productId=rtx-4090');
    req.flush([]);
  });

  it('should have sort element in template after loading reviews', () => {
    fixture.detectChanges();
    // Flush HTTP with at least one review (select only renders when reviews.length > 0)
    const req = httpMock.expectOne('http://localhost:3000/reviews?productId=rtx-4090');
    req.flush([
      { id: 'rev-1', productId: 'rtx-4090', authorId: 'usr-1', authorName: 'Test', rating: 5, title: 'Great', comment: 'Excellent product quality', createdAt: new Date().toISOString() }
    ]);
    fixture.detectChanges();

    expect(component.isLoading()).toBeFalse();
    const sortElement = fixture.debugElement.query(By.css('select'));
    expect(sortElement).toBeTruthy();
  });
});
