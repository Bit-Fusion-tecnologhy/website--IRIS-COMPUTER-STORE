import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReviewCardComponent } from './review-card.component';
import { Review } from '../../../../core/models/review';

describe('ReviewCardComponent', () => {
  let component: ReviewCardComponent;
  let fixture: ComponentFixture<ReviewCardComponent>;

  const mockReview: Review = {
    id: 'rev-001',
    productId: 'rtx-4090',
    authorId: 'usr-iris-01',
    authorName: 'Alex Vance',
    rating: 5,
    title: 'Potencia impresionante',
    comment: 'La RTX 4090 supera todas mis expectativas.',
    createdAt: '2026-03-15T10:30:00.000Z',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('review', mockReview);
    fixture.componentRef.setInput('isOwnReview', false);
    fixture.componentRef.setInput('sellerReplies', []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display author name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Alex Vance');
  });

  it('should display review title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Potencia impresionante');
  });

  it('should display review comment', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('La RTX 4090 supera todas mis expectativas.');
  });

  it('should have 5 star elements', () => {
    const stars = fixture.debugElement.queryAll(By.css('.material-symbols-outlined'));
    expect(stars.length).toBeGreaterThanOrEqual(5);
  });
});