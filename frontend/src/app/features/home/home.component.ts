import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProblemService } from '../../core/services/problem.service';
import { BookmarkService } from '../../core/services/bookmark.service';
import { AuthService } from '../../core/services/auth.service';
import { Problem } from '../../shared/models/problem.model';
import { ProblemCardComponent } from '../../shared/components/problem-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ProblemCardComponent],
  template: `
    <div class="space-y-16 pb-20">
      <!-- 1. Hero Section -->
      <section class="max-w-5xl mx-auto px-4 pt-14 sm:pt-20 text-center space-y-6">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold tracking-wider uppercase">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
          Curated Real-World Problem Marketplace
        </div>
        
        <h1 class="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08]">
          Discover Real Problems.<br />
          <span class="text-amber-500">Build High-Impact Projects.</span>
        </h1>
        
        <p class="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          The curated discovery hub for hackathons, engineering capstones, and portfolio builders.
          Move from problem ambiguity to concrete software architecture.
        </p>

        <!-- Quick Search Bar -->
        <div class="max-w-2xl mx-auto pt-3">
          <form (submit)="onSearchSubmit()" class="flex items-center bg-zinc-900 rounded-2xl border-2 border-zinc-800 shadow-2xl focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all p-1.5">
            <div class="pl-3.5 text-zinc-500">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <input
              type="text"
              [(ngModel)]="searchKeyword"
              name="search"
              placeholder="Search problem statements (e.g. insulin, carbon, telemetry, fraud)..."
              class="w-full px-3 py-2 text-sm bg-transparent focus:outline-none text-white placeholder-zinc-500"
            />
            <button
              type="submit"
              class="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black rounded-xl text-xs sm:text-sm font-black transition-all whitespace-nowrap shadow-md shadow-amber-500/20">
              Search Hub
            </button>
          </form>

          <!-- Trending Topics Quick Chips -->
          <div class="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
            <span class="text-zinc-500 font-semibold text-[11px]">Trending Domains:</span>
            <a
              *ngFor="let domain of ['Healthcare', 'FinTech', 'Cybersecurity', 'CleanTech', 'Cloud Native']"
              [routerLink]="['/problems']"
              [queryParams]="{ domain: domain }"
              class="px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 hover:text-amber-400 text-zinc-400 text-[11px] font-medium transition-colors">
              #{{ domain }}
            </a>
          </div>
        </div>

        <!-- 5-Step Workflow Principle -->
        <div class="pt-8 grid grid-cols-2 sm:grid-cols-5 gap-3 text-center max-w-4xl mx-auto text-xs">
          <div class="p-3.5 bg-zinc-900/90 rounded-xl border border-zinc-800/90 shadow-sm hover:border-amber-500/40 transition-colors">
            <span class="font-extrabold text-amber-400">1. Discover</span>
            <p class="text-zinc-400 text-[11px] mt-0.5">Industry gaps</p>
          </div>
          <div class="p-3.5 bg-zinc-900/90 rounded-xl border border-zinc-800/90 shadow-sm hover:border-amber-500/40 transition-colors">
            <span class="font-extrabold text-amber-400">2. Understand</span>
            <p class="text-zinc-400 text-[11px] mt-0.5">Root pain points</p>
          </div>
          <div class="p-3.5 bg-zinc-900/90 rounded-xl border border-zinc-800/90 shadow-sm hover:border-amber-500/40 transition-colors">
            <span class="font-extrabold text-amber-400">3. Filter</span>
            <p class="text-zinc-400 text-[11px] mt-0.5">By tech & scope</p>
          </div>
          <div class="p-3.5 bg-zinc-900/90 rounded-xl border border-zinc-800/90 shadow-sm hover:border-amber-500/40 transition-colors">
            <span class="font-extrabold text-amber-400">4. Shortlist</span>
            <p class="text-zinc-400 text-[11px] mt-0.5">Evaluate ideas</p>
          </div>
          <div class="p-3.5 bg-zinc-900/90 rounded-xl border border-zinc-800/90 shadow-sm hover:border-amber-500/40 transition-colors col-span-2 sm:col-span-1">
            <span class="font-extrabold text-amber-400">5. Build</span>
            <p class="text-zinc-400 text-[11px] mt-0.5">Ship products</p>
          </div>
        </div>
      </section>

      <!-- 2. Popular Domains -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-xl font-black text-white tracking-tight">Explore by Domain</h2>
            <p class="text-xs text-zinc-400 mt-0.5">Browse challenges across specialized industries and fields.</p>
          </div>
          <a routerLink="/problems" class="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors">
            View All Domains →
          </a>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <a
            *ngFor="let domain of popularDomains"
            [routerLink]="['/problems']"
            [queryParams]="{ domain: domain.name }"
            class="p-4 bg-zinc-900 border border-zinc-800 hover:border-amber-500/60 hover:bg-zinc-850 rounded-2xl transition-all group text-left">
            <div class="text-2xl mb-2">{{ domain.icon }}</div>
            <h3 class="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">{{ domain.name }}</h3>
            <p class="text-[11px] text-zinc-500 mt-0.5 truncate">{{ domain.count }}</p>
          </a>
        </div>
      </section>

      <!-- 3. Featured & Recently Added Problems -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-xl font-black text-white tracking-tight">Featured Problem Statements</h2>
            <p class="text-xs text-zinc-400 mt-0.5">Curated, high-impact statements verified and ready to build.</p>
          </div>
          <a routerLink="/problems" class="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors">
            See all 20+ problems →
          </a>
        </div>

        <!-- Cards Grid Skeleton Loader -->
        <div *ngIf="loading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div *ngFor="let n of [1,2,3]" class="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 animate-pulse space-y-4">
            <div class="h-4 bg-zinc-800 rounded w-1/3"></div>
            <div class="h-6 bg-zinc-800 rounded w-3/4"></div>
            <div class="h-16 bg-zinc-800 rounded w-full"></div>
            <div class="h-4 bg-zinc-800 rounded w-1/2"></div>
          </div>
        </div>

        <div *ngIf="!loading && featuredProblems.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <app-problem-card
            *ngFor="let problem of featuredProblems"
            [problem]="problem"
            (bookmarkToggle)="toggleBookmark($event)">
          </app-problem-card>
        </div>
      </section>
    </div>
  `
})
export class HomeComponent implements OnInit {
  private readonly problemService = inject(ProblemService);
  private readonly bookmarkService = inject(BookmarkService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  searchKeyword = '';
  featuredProblems: Problem[] = [];
  loading = true;

  popularDomains = [
    { name: 'Healthcare', icon: '🩺', count: 'Real-time & Telemetry' },
    { name: 'FinTech', icon: '💳', count: 'Credit & Anomaly Models' },
    { name: 'Civic Tech', icon: '🏛️', count: 'Community & Public Services' },
    { name: 'CleanTech', icon: '⚡', count: 'Energy & Sustainability' },
    { name: 'Cybersecurity', icon: '🛡️', count: 'API & Supply Chain' },
    { name: 'EdTech', icon: '🎓', count: 'Learning & Accessibility' }
  ];

  ngOnInit(): void {
    this.problemService.getProblems({ size: 6, sortBy: 'createdAt', sortDir: 'DESC' }).subscribe({
      next: (res) => {
        this.featuredProblems = res.content.slice(0, 3);
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  onSearchSubmit(): void {
    if (this.searchKeyword.trim()) {
      this.router.navigate(['/problems'], { queryParams: { keyword: this.searchKeyword.trim() } });
    }
  }

  toggleBookmark(problem: Problem): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: '/' } });
      return;
    }

    if (problem.bookmarked) {
      this.bookmarkService.removeBookmark(problem.id).subscribe({
        next: () => {
          problem.bookmarked = false;
          this.cdr.markForCheck();
        }
      });
    } else {
      this.bookmarkService.addBookmark(problem.id).subscribe({
        next: () => {
          problem.bookmarked = true;
          this.cdr.markForCheck();
        }
      });
    }
  }
}
