import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-md mx-auto px-4 py-16">
      <div class="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-2xl relative overflow-hidden">
        <!-- Ambient gold glow -->
        <div class="absolute -top-20 left-1/2 -translate-x-1/2 w-56 h-20 bg-amber-500/10 blur-3xl pointer-events-none"></div>

        <div class="text-center mb-8 relative z-10">
          <div class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm font-black mb-4 shadow-inner">
            <span class="text-white tracking-tight">Problem</span>
            <span class="bg-amber-500 text-black px-1.5 py-0.5 rounded text-xs font-black">HUB</span>
          </div>
          <h2 class="text-2xl font-black text-white tracking-tight">Create your Account</h2>
          <p class="text-xs text-zinc-400 mt-1.5">Join students discovering and building real-world projects.</p>
        </div>

        <!-- Error Alert -->
        <div *ngIf="error" class="mb-5 p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 font-medium relative z-10 flex items-center gap-2">
          <svg class="w-4 h-4 text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <span>{{ error }}</span>
        </div>

        <!-- Registration Form -->
        <form (ngSubmit)="onSubmit()" class="space-y-4 relative z-10">
          <div>
            <label class="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1.5">Full Name</label>
            <input
              type="text"
              [(ngModel)]="name"
              name="name"
              required
              placeholder="e.g. Jordan Miller"
              class="w-full px-3.5 py-2.5 text-sm bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
            />
          </div>

          <div>
            <label class="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1.5">Email Address</label>
            <input
              type="email"
              [(ngModel)]="email"
              name="email"
              required
              placeholder="jordan@student.edu"
              class="w-full px-3.5 py-2.5 text-sm bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
            />
          </div>

          <div>
            <label class="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1.5">Password (min 6 characters)</label>
            <input
              type="password"
              [(ngModel)]="password"
              name="password"
              required
              minlength="6"
              placeholder="••••••••"
              class="w-full px-3.5 py-2.5 text-sm bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            [disabled]="loading || !name || !email || password.length < 6"
            class="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-black font-black rounded-xl text-sm shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2">
            <span *ngIf="loading" class="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <div class="mt-6 text-center text-xs text-zinc-400 relative z-10">
          Already have an account?
          <a routerLink="/auth/login" class="text-amber-400 hover:text-amber-300 font-bold hover:underline ml-1">
            Sign in
          </a>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  name = '';
  email = '';
  password = '';
  loading = false;
  error: string | null = null;

  onSubmit(): void {
    if (!this.name || !this.email || this.password.length < 6) return;

    this.loading = true;
    this.error = null;

    this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.loading = false;
        this.cdr.markForCheck();
        this.router.navigate(['/problems']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Registration failed. Please try again.';
        this.cdr.markForCheck();
      }
    });
  }
}
