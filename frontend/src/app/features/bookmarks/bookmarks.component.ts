import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BookmarkService } from '../../core/services/bookmark.service';
import { Problem } from '../../shared/models/problem.model';
import { ProblemCardComponent } from '../../shared/components/problem-card.component';

@Component({
  selector: 'app-bookmarks',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ProblemCardComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h1 class="text-3xl sm:text-4xl font-black text-white tracking-tight">Your Shortlisted Problems</h1>
          <p class="text-sm text-zinc-400 mt-1">
            Personal candidate statements saved for your upcoming hackathons and project milestones.
          </p>
        </div>

        <div *ngIf="bookmarks.length > 0" class="flex items-center gap-3">
          <span class="text-xs px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
            {{ bookmarks.length }} {{ bookmarks.length === 1 ? 'Problem' : 'Problems' }} Shortlisted
          </span>
        </div>
      </div>

      <!-- Quick Search within Bookmarks -->
      <div *ngIf="bookmarks.length > 3">
        <div class="relative max-w-md">
          <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </span>
          <input
            type="text"
            [(ngModel)]="filterQuery"
            placeholder="Filter within shortlisted problems..."
            class="w-full pl-10 pr-4 py-2.5 text-xs bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
          />
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let n of [1,2,3]" class="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 animate-pulse space-y-4">
          <div class="h-4 bg-zinc-800 rounded w-1/3"></div>
          <div class="h-6 bg-zinc-800 rounded w-3/4"></div>
          <div class="h-16 bg-zinc-800 rounded w-full"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && bookmarks.length === 0" class="text-center py-20 bg-zinc-900/60 border border-dashed border-zinc-800 rounded-2xl max-w-2xl mx-auto p-8">
        <div class="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-white">Your Shortlist is Empty</h3>
        <p class="text-xs text-zinc-400 mt-2 max-w-sm mx-auto leading-relaxed">
          Browse real-world problem statements and bookmark the most promising specs to compare and architect with your team.
        </p>
        <a
          routerLink="/problems"
          class="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black rounded-xl text-xs font-black shadow-md shadow-amber-500/20 transition-all">
          Browse Problem Statements
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </a>
      </div>

      <!-- Bookmarked Problems Grid -->
      <div *ngIf="!loading && filteredBookmarks.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <app-problem-card
          *ngFor="let problem of filteredBookmarks"
          [problem]="problem"
          (bookmarkToggle)="removeBookmark($event)">
        </app-problem-card>
      </div>
    </div>
  `
})
export class BookmarksComponent implements OnInit {
  private readonly bookmarkService = inject(BookmarkService);
  private readonly cdr = inject(ChangeDetectorRef);

  bookmarks: Problem[] = [];
  filterQuery = '';
  loading = true;

  get filteredBookmarks(): Problem[] {
    if (!this.filterQuery.trim()) {
      return this.bookmarks;
    }
    const q = this.filterQuery.toLowerCase().trim();
    return this.bookmarks.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q) ||
      b.domain.toLowerCase().includes(q)
    );
  }

  ngOnInit(): void {
    this.loadBookmarks();
  }

  loadBookmarks(): void {
    this.loading = true;
    this.bookmarkService.getUserBookmarks().subscribe({
      next: (data) => {
        this.bookmarks = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  removeBookmark(problem: Problem): void {
    this.bookmarkService.removeBookmark(problem.id).subscribe({
      next: () => {
        this.bookmarks = this.bookmarks.filter(b => b.id !== problem.id);
        this.cdr.markForCheck();
      }
    });
  }
}
