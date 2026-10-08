import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProblemService } from '../../core/services/problem.service';
import { BookmarkService } from '../../core/services/bookmark.service';
import { AuthService } from '../../core/services/auth.service';
import { Problem } from '../../shared/models/problem.model';

@Component({
  selector: 'app-problem-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <!-- Breadcrumb Navigation -->
      <nav class="flex items-center gap-2 text-xs text-zinc-400">
        <a routerLink="/problems" class="hover:text-amber-400 font-semibold transition-colors flex items-center gap-1">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
          Back to Problem Catalog
        </a>
        <span class="text-zinc-600">/</span>
        <span *ngIf="problem" class="text-zinc-300 truncate font-medium">{{ problem.title }}</span>
      </nav>

      <!-- Loading State -->
      <div *ngIf="loading" class="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 animate-pulse space-y-6">
        <div class="h-6 bg-zinc-800 rounded w-1/4"></div>
        <div class="h-10 bg-zinc-800 rounded w-3/4"></div>
        <div class="h-32 bg-zinc-800 rounded w-full"></div>
      </div>

      <!-- Error State -->
      <div *ngIf="error && !loading" class="text-center p-12 bg-zinc-900 border border-zinc-800 rounded-2xl">
        <h2 class="text-lg font-bold text-white">Problem Statement Not Found</h2>
        <p class="text-xs text-zinc-400 mt-2">{{ error }}</p>
        <a routerLink="/problems" class="inline-block mt-4 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-black rounded-xl transition-colors">
          Return to Catalog
        </a>
      </div>

      <!-- Problem Content -->
      <article *ngIf="problem && !loading" class="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden">
        <!-- Header Banner -->
        <div class="p-6 sm:p-8 border-b border-zinc-800/80 bg-zinc-950/40">
          <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md bg-zinc-800 text-zinc-200 border border-zinc-700/60">
                {{ problem.domain }}
              </span>
              <span [ngClass]="getDifficultyBadgeClass(problem.difficulty)" class="px-3 py-1 text-xs font-black uppercase tracking-wide rounded-md">
                {{ problem.difficulty }}
              </span>
              <span class="px-3 py-1 text-xs font-semibold rounded-md bg-zinc-800 text-amber-300 border border-zinc-700/50">
                {{ formatProjectType(problem.projectType) }}
              </span>
            </div>

            <!-- Bookmark Shortlist Button -->
            <button
              (click)="toggleBookmark()"
              [ngClass]="problem.bookmarked 
                ? 'bg-amber-500/15 text-amber-400 border-amber-500/50' 
                : 'bg-amber-500 hover:bg-amber-400 text-black border-amber-500 font-black shadow-md shadow-amber-500/20'"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all">
              <svg class="w-4 h-4" [attr.fill]="problem.bookmarked ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              {{ problem.bookmarked ? 'Saved to Shortlist' : 'Add to Shortlist' }}
            </button>
          </div>

          <h1 class="text-2xl sm:text-4xl font-black text-white leading-tight tracking-tight">
            {{ problem.title }}
          </h1>

          <div class="mt-4 flex flex-wrap items-center gap-3 text-xs text-zinc-400 font-medium">
            <span *ngIf="problem.createdByName" class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-amber-500"></span>
              Curated by <strong class="text-zinc-200">{{ problem.createdByName }}</strong>
            </span>
            <span class="text-zinc-600">•</span>
            <span>Added {{ problem.createdAt | date:'mediumDate' }}</span>
            <span *ngIf="problem.status" class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                  [ngClass]="problem.status === 'PUBLISHED' ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800' : 'bg-zinc-800 text-zinc-400'">
              {{ problem.status }}
            </span>
          </div>
        </div>

        <!-- Body Details -->
        <div class="p-6 sm:p-8 space-y-8">
          <!-- 1. The Core Problem -->
          <section>
            <h2 class="text-xs font-bold uppercase tracking-wider text-amber-500 mb-2">Problem Statement & Background</h2>
            <p class="text-zinc-200 text-base leading-relaxed whitespace-pre-line font-medium">
              {{ problem.description }}
            </p>
          </section>

          <!-- 2. Impact & Why it matters -->
          <section *ngIf="problem.impact" class="p-5 bg-amber-950/20 rounded-xl border-l-4 border-amber-500 border border-zinc-800">
            <h2 class="text-xs font-extrabold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-2">
              <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              Real-World Impact & Why It Matters
            </h2>
            <p class="text-sm text-zinc-300 leading-relaxed">
              {{ problem.impact }}
            </p>
          </section>

          <!-- 3. Possible Solution Direction -->
          <section *ngIf="problem.solutionDirection" class="p-5 bg-zinc-950/70 rounded-xl border border-zinc-800">
            <h2 class="text-xs font-extrabold uppercase tracking-wider text-zinc-300 mb-2 flex items-center gap-2">
              <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
              Architectural & Solution Direction
            </h2>
            <p class="text-sm text-zinc-300 leading-relaxed">
              {{ problem.solutionDirection }}
            </p>
          </section>

          <!-- 4. Expected Deliverable / Outcome -->
          <section *ngIf="problem.expectedOutcome">
            <h2 class="text-xs font-bold uppercase tracking-wider text-amber-500 mb-2">Expected Project Deliverable</h2>
            <p class="text-sm text-zinc-200 leading-relaxed bg-zinc-950 p-4 rounded-xl border border-zinc-800 font-mono">
              {{ problem.expectedOutcome }}
            </p>
          </section>

          <!-- 5. Technologies Stack -->
          <section>
            <h2 class="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">Recommended Technologies</h2>
            <div class="flex flex-wrap gap-2">
              <span *ngFor="let tech of problem.technologies" class="px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-amber-400 text-xs font-mono font-medium">
                {{ tech.name }}
              </span>
              <span *ngIf="!problem.technologies || problem.technologies.length === 0" class="text-xs text-zinc-500 italic">
                Any modern full-stack or mobile architecture
              </span>
            </div>
          </section>

          <!-- 6. Tags -->
          <section *ngIf="problem.tags && problem.tags.length > 0">
            <h2 class="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">Associated Categories & Tags</h2>
            <div class="flex flex-wrap gap-2">
              <span *ngFor="let tag of problem.tags" class="px-3 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-400 text-xs">
                #{{ tag.name }}
              </span>
            </div>
          </section>

          <!-- Bottom Action Callout -->
          <div class="mt-10 p-6 bg-gradient-to-r from-zinc-950 via-zinc-900 to-black rounded-2xl border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 class="font-extrabold text-white text-base">Ready to engineer this project?</h3>
              <p class="text-xs text-zinc-400 mt-1">Shortlist this problem to your candidate dashboard or review it with your team.</p>
            </div>
            <button
              (click)="toggleBookmark()"
              class="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black rounded-xl text-xs font-black tracking-wide transition-all whitespace-nowrap shadow-md shadow-amber-500/20">
              {{ problem.bookmarked ? 'Saved to Shortlist' : 'Add to Shortlist' }}
            </button>
          </div>
        </div>
      </article>
    </div>
  `
})
export class ProblemDetailsComponent implements OnInit {
  private readonly problemService = inject(ProblemService);
  private readonly bookmarkService = inject(BookmarkService);
  readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  problem: Problem | null = null;
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.loadProblem(id);
    } else {
      this.error = 'Invalid problem statement ID.';
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  loadProblem(id: number): void {
    this.loading = true;
    this.error = null;

    this.problemService.getProblemById(id).subscribe({
      next: (data) => {
        this.problem = data;
        this.loading = false;
        this.cdr.markForCheck();
        this.checkBookmarkStatus(id);
      },
      error: (err) => {
        this.error = err.error?.message || 'Problem statement not found.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  private checkBookmarkStatus(problemId: number): void {
    if (this.authService.isLoggedIn()) {
      this.bookmarkService.getUserBookmarks().subscribe({
        next: (bookmarks) => {
          if (this.problem) {
            this.problem.bookmarked = bookmarks.some(b => b.id === problemId);
            this.cdr.markForCheck();
          }
        }
      });
    }
  }

  toggleBookmark(): void {
    if (!this.problem) return;

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: `/problems/${this.problem.id}` }
      });
      return;
    }

    if (this.problem.bookmarked) {
      this.bookmarkService.removeBookmark(this.problem.id).subscribe({
        next: () => {
          if (this.problem) {
            this.problem.bookmarked = false;
            this.cdr.markForCheck();
          }
        }
      });
    } else {
      this.bookmarkService.addBookmark(this.problem.id).subscribe({
        next: () => {
          if (this.problem) {
            this.problem.bookmarked = true;
            this.cdr.markForCheck();
          }
        }
      });
    }
  }

  getDifficultyBadgeClass(difficulty: string): string {
    switch (difficulty?.toUpperCase()) {
      case 'BEGINNER':
        return 'bg-emerald-950/70 text-emerald-400 border border-emerald-850';
      case 'INTERMEDIATE':
        return 'bg-amber-950/70 text-amber-400 border border-amber-800';
      case 'ADVANCED':
        return 'bg-rose-950/70 text-rose-400 border border-rose-850';
      default:
        return 'bg-zinc-800 text-zinc-400 border border-zinc-700';
    }
  }

  formatProjectType(type: string): string {
    if (!type) return '';
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }
}
