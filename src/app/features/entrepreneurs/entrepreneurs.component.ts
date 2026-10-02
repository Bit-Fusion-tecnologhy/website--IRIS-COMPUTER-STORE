import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EntrepreneurService } from '../../core/services/entrepreneur.service';
import { Entrepreneur, VideoTestimony, AccompanyPrinciple } from '../../core/models/entrepreneur';

/** Maps each entrepreneur category to its Material icon name. */
export const CATEGORY_ICONS: Record<Entrepreneur['category'], string> = {
  Estudiante: 'school',
  Emprendedor: 'rocket_launch',
  Creador: 'videocam',
  Profesional: 'work',
  Comunidad: 'groups',
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule],
  templateUrl: './entrepreneurs.component.html',
  styleUrl: './entrepreneurs.component.css',
})
export class EntrepreneursComponent implements OnInit {
  private readonly entrepreneurService = inject(EntrepreneurService);

  readonly entrepreneurs = signal<Entrepreneur[]>([]);
  readonly videos = signal<VideoTestimony[]>([]);
  readonly principles = signal<AccompanyPrinciple[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  /** Category → icon lookup for the template. */
  readonly categoryIcons = CATEGORY_ICONS;

  readonly featuredEntrepreneur = computed(() =>
    this.entrepreneurs().find(e => e.featured) ?? this.entrepreneurs()[0] ?? null
  );

  readonly secondaryEntrepreneurs = computed(() =>
    this.entrepreneurs().filter(e => !e.featured)
  );

  /** Patrón Bento: cada 5to item es grande (col-span-2) */
  isLarge(index: number): boolean {
    return index % 5 === 0;
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    forkJoin({
      entrepreneurs: this.entrepreneurService.getEntrepreneurs().pipe(
        catchError(() => {
          console.warn('Entrepreneurs endpoint unavailable');
          return of<Entrepreneur[]>([]);
        }),
      ),
      videos: this.entrepreneurService.getVideos().pipe(
        catchError(() => {
          console.warn('Videos endpoint unavailable');
          return of<VideoTestimony[]>([]);
        }),
      ),
      principles: this.entrepreneurService.getPrinciples().pipe(
        catchError(() => {
          console.warn('Principles endpoint unavailable');
          return of<AccompanyPrinciple[]>([]);
        }),
      ),
    }).subscribe({
      next: (data) => {
        this.entrepreneurs.set(data.entrepreneurs);
        this.videos.set(data.videos);
        this.principles.set(data.principles);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Unexpected error fetching entrepreneurs data:', err);
        this.errorMessage.set('No se pudo conectar con el servidor. Asegúrate de que json-server esté corriendo.');
        this.isLoading.set(false);
      },
    });
  }
}
