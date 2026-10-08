import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
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
          <h2 class="text-2xl font-black text-white tracking-tight">Sign in to Problem Hub</h2>
          <p class="text-xs text-zinc-400 mt-1.5">Shortlist real-world specs, bookmark challenges & build real software.</p>
        </div>

        <!-- Quick Demo Credentials Helpers -->
        <div class="mb-6 p-3.5 bg-zinc-950/80 rounded-xl border border-zinc-800/80 text-xs space-y-2.5 relative z-10">
          <span class="font-bold uppercase tracking-wider text-[11px] text-zinc-400 block">Quick Demo Logins</span>
          <div class="flex gap-2">
            <button
              type="button"
              (click)="fillDemo('student@problemhub.com', 'student123')"
              class="flex-1 py-1.5 px-2.5 bg-zinc-900 hover:bg-amber-500 hover:text-black border border-zinc-700/80 hover:border-amber-500 rounded-lg text-amber-400 font-bold transition-all text-xs">
              Student Demo
            </button>
            <button
              type="button"
              (click)="fillDemo('admin@problemhub.com', 'admin123')"
              class="flex-1 py-1.5 px-2.5 bg-zinc-900 hover:bg-amber-500 hover:text-black border border-zinc-700/80 hover:border-amber-500 rounded-lg text-zinc-300 font-bold transition-all text-xs">
              Admin Demo
            </button>
          </div>
        </div>

        <!-- Error Message Alert -->
        <div *ngIf="error" class="mb-5 p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 font-medium relative z-10 flex items-center gap-2">
          <svg class="w-4 h-4 text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <span>{{ error }}</span>
        </div>

        <!-- Login Form -->
        <form (ngSubmit)="onSubmit()" class="space-y-4 relative z-10">
          <div>
            <label class="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1.5">Email Address</label>
            <input
              type="email"
              [(ngModel)]="email"
              name="email"
              required
              placeholder="you@university.edu"
              class="w-full px-3.5 py-2.5 text-sm bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
            />
          </div>

          <div>
            <label class="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1.5">Password</label>
            <input
              type="password"
              [(ngModel)]="password"
              name="password"
              required
              placeholder="••••••••"
              class="w-full px-3.5 py-2.5 text-sm bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            [disabled]="loading || !email || !password"
            class="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-black font-black rounded-xl text-sm shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2">
            <span *ngIf="loading" class="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <div class="mt-6 text-center text-xs text-zinc-400 relative z-10">
          New to Problem Hub?
          <a routerLink="/auth/register" class="text-amber-400 hover:text-amber-300 font-bold hover:underline ml-1">
            Create an account
          </a>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);

  email = '';
  password = '';
  loading = false;
  error: string | null = null;

  fillDemo(email: string, pass: string): void {
    this.email = email;
    this.password = pass;
    this.error = null;
    this.cdr.markForCheck();
  }

  onSubmit(): void {
    if (!this.email || !this.password) return;

    this.loading = true;
    this.error = null;

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.loading = false;
        this.cdr.markForCheck();
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/problems';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Invalid email or password. Please try again.';
        this.cdr.markForCheck();
      }
    });
  }
}
