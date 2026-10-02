import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReviewsSkeletonComponent } from './reviews-skeleton.component';

describe('ReviewsSkeletonComponent', () => {
  let component: ReviewsSkeletonComponent;
  let fixture: ComponentFixture<ReviewsSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewsSkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewsSkeletonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});