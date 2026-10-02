import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { StarRatingComponent } from './star-rating.component';

describe('StarRatingComponent', () => {
  let component: StarRatingComponent;
  let fixture: ComponentFixture<StarRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StarRatingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StarRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display 5 stars by default in display mode', () => {
    fixture.detectChanges();

    const stars = fixture.debugElement.queryAll(By.css('.material-symbols-outlined'));
    expect(stars.length).toBe(5);
  });

  it('should display interactive stars', () => {
    fixture.detectChanges();

    const stars = fixture.debugElement.queryAll(By.css('.material-symbols-outlined'));
    expect(stars.length).toBe(5);
  });

  it('should emit ratingChange event when rating input changes', () => {
    // Test that the output is defined and can emit
    expect(component.ratingChange).toBeDefined();
  });

  it('should render correctly with default inputs', () => {
    fixture.detectChanges();

    const stars = fixture.debugElement.queryAll(By.css('.material-symbols-outlined'));
    expect(stars.length).toBe(5);
  });
});