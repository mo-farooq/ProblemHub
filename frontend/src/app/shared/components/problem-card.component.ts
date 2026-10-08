import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Problem } from '../models/problem.model';

@Component({
  selector: 'app-problem-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-zinc-900 border border-zinc-800/90 hover:border-amber-500/60 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(245,158,11,0.12)] group hover:-translate-y-0.5 relative">
      <div>
        <!-- Top metadata badges row -->
        <div class="flex items-center justify-between gap-2 mb-3">
          <div class="flex flex-wrap items-center gap-1.5">
            <span class="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700/60">
              {{ problem.domain }}
            </span>
            <span [ngClass]="getDifficultyBadgeClass(problem.difficulty)" class="px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wide rounded-md">
              {{ problem.difficulty }}
            </span>
            <span class="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-zinc-800/70 text-amber-300/90 border border-zinc-700/40">
              {{ formatProjectType(problem.projectType) }}
            </span>
          </div>

          <!-- Bookmark Toggle Button -->
          <button 
            type="button" 
            (click)="onBookmarkClick($event)" 
            [attr.aria-label]="problem.bookmarked ? 'Remove from shortlist' : 'Save to shortlist'"
            class="p-1.5 rounded-lg transition-colors border"
            [ngClass]="problem.bookmarked 
              ? 'text-amber-400 bg-amber-500/15 border-amber-500/40' 
              : 'text-zinc-500 hover:text-amber-400 hover:bg-zinc-800 border-transparent'">
            <svg class="w-4 h-4" [attr.fill]="problem.bookmarked ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>

        <!-- Problem Title -->
        <h3 class="text-base font-extrabold text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug tracking-tight">
          <a [routerLink]="['/problems', problem.id]">
            {{ problem.title }}
          </a>
        </h3>

        <!-- Creator / Organization metadata -->
        <div class="flex items-center gap-1.5 text-[11px] text-zinc-500 mt-1 font-medium">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          <span>{{ problem.createdByName || 'Verified Spec' }}</span>
        </div>

        <!-- Problem Description -->
        <p class="text-xs text-zinc-400 mt-2.5 line-clamp-3 leading-relaxed">
          {{ problem.description }}
        </p>

        <!-- Tech Stack Pills -->
        <div *ngIf="problem.technologies && problem.technologies.length > 0" class="mt-4 flex flex-wrap gap-1.5 items-center">
          <span *ngFor="let tech of problem.technologies.slice(0, 4)" class="text-[11px] px-2 py-0.5 rounded bg-zinc-950/80 text-amber-400/90 font-mono font-medium border border-zinc-800">
            {{ tech.name }}
          </span>
          <span *ngIf="problem.technologies.length > 4" class="text-[10px] text-zinc-500 font-mono">
            +{{ problem.technologies.length - 4 }}
          </span>
        </div>
      </div>

      <!-- Bottom action bar -->
      <div class="mt-5 pt-3.5 border-t border-zinc-800/80 flex items-center justify-between text-xs">
        <div class="flex items-center gap-1.5 overflow-hidden">
          <span *ngFor="let tag of problem.tags.slice(0, 2)" class="text-[11px] text-zinc-500 truncate">
            #{{ tag.name }}
          </span>
        </div>

        <a
          [routerLink]="['/problems', problem.id]"
          class="inline-flex items-center gap-1.5 bg-zinc-800 group-hover:bg-amber-500 group-hover:text-black text-zinc-200 text-xs font-black py-1.5 px-3 rounded-lg border border-zinc-700/80 group-hover:border-amber-400 transition-all shadow-xs">
          Inspect Spec
          <svg class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  `
})
export class ProblemCardComponent {
  @Input({ required: true }) problem!: Problem;
  @Output() bookmarkToggle = new EventEmitter<Problem>();

  onBookmarkClick(event: Event) {
    event.stopPropagation();
    this.bookmarkToggle.emit(this.problem);
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
