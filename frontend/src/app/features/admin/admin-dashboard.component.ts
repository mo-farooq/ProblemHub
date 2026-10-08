import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService, AdminStats } from '../../core/services/admin.service';
import { ProblemService } from '../../core/services/problem.service';
import { Problem, ProblemStatus, Tag, Technology } from '../../shared/models/problem.model';

type AdminTab = 'overview' | 'problems' | 'technologies' | 'tags';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header with Tabs -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div class="flex items-center gap-2.5">
            <h1 class="text-3xl font-black text-white tracking-tight">Admin Console</h1>
            <span class="px-2.5 py-0.5 text-[10px] font-black rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase tracking-widest">SUPER ADMIN</span>
          </div>
          <p class="text-xs text-zinc-400 mt-1">
            Manage real-world problem statements, curate technology stacks, and oversee platform taxonomy.
          </p>
        </div>

        <!-- Tab Pills -->
        <div class="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 p-1.5 rounded-xl">
          <button
            (click)="activeTab = 'overview'"
            [class.bg-amber-500]="activeTab === 'overview'"
            [class.text-black]="activeTab === 'overview'"
            [class.font-extrabold]="activeTab === 'overview'"
            [class.shadow-sm]="activeTab === 'overview'"
            [class.text-zinc-400]="activeTab !== 'overview'"
            class="px-4 py-2 text-xs font-bold rounded-lg transition-all hover:text-white">
            Overview
          </button>
          <button
            (click)="activeTab = 'problems'"
            [class.bg-amber-500]="activeTab === 'problems'"
            [class.text-black]="activeTab === 'problems'"
            [class.font-extrabold]="activeTab === 'problems'"
            [class.shadow-sm]="activeTab === 'problems'"
            [class.text-zinc-400]="activeTab !== 'problems'"
            class="px-4 py-2 text-xs font-bold rounded-lg transition-all hover:text-white">
            Problems
          </button>
          <button
            (click)="activeTab = 'technologies'"
            [class.bg-amber-500]="activeTab === 'technologies'"
            [class.text-black]="activeTab === 'technologies'"
            [class.font-extrabold]="activeTab === 'technologies'"
            [class.shadow-sm]="activeTab === 'technologies'"
            [class.text-zinc-400]="activeTab !== 'technologies'"
            class="px-4 py-2 text-xs font-bold rounded-lg transition-all hover:text-white">
            Technologies
          </button>
          <button
            (click)="activeTab = 'tags'"
            [class.bg-amber-500]="activeTab === 'tags'"
            [class.text-black]="activeTab === 'tags'"
            [class.font-extrabold]="activeTab === 'tags'"
            [class.shadow-sm]="activeTab === 'tags'"
            [class.text-zinc-400]="activeTab !== 'tags'"
            class="px-4 py-2 text-xs font-bold rounded-lg transition-all hover:text-white">
            Tags
          </button>
        </div>
      </div>

      <!-- Feedback Banner -->
      <div *ngIf="notification" class="mt-4 p-4 rounded-xl border flex items-center justify-between"
           [ngClass]="notification.type === 'success' ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300' : 'bg-rose-950/40 border-rose-800/60 text-rose-300'">
        <div class="flex items-center gap-2.5 text-xs font-bold">
          <svg *ngIf="notification.type === 'success'" class="w-4 h-4 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <svg *ngIf="notification.type === 'error'" class="w-4 h-4 text-rose-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          <span>{{ notification.message }}</span>
        </div>
        <button (click)="notification = null" class="text-xs font-bold opacity-60 hover:opacity-100 text-white">✕</button>
      </div>

      <!-- TAB 1: OVERVIEW -->
      <div *ngIf="activeTab === 'overview'" class="mt-6 space-y-8">
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <!-- Total Problems -->
          <div class="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-colors shadow-lg">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Total Statements</span>
              <span class="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              </span>
            </div>
            <p class="text-3xl font-black text-white mt-2">{{ stats?.totalProblems || 0 }}</p>
            <div class="flex items-center gap-2 mt-3 text-xs text-zinc-400">
              <span class="text-emerald-400 font-bold">{{ stats?.publishedProblems || 0 }} Published</span>
              <span class="text-zinc-600">·</span>
              <span class="text-amber-400 font-bold">{{ stats?.draftProblems || 0 }} Drafts</span>
              <span class="text-zinc-600">·</span>
              <span class="text-zinc-500 font-bold">{{ stats?.archivedProblems || 0 }} Archived</span>
            </div>
          </div>

          <!-- Total Students -->
          <div class="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-colors shadow-lg">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Active Students</span>
              <span class="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              </span>
            </div>
            <p class="text-3xl font-black text-white mt-2">{{ stats?.totalStudents || 0 }}</p>
            <p class="text-xs text-zinc-500 mt-3">Out of {{ stats?.totalUsers || 0 }} total registered accounts</p>
          </div>

          <!-- Bookmarks -->
          <div class="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-colors shadow-lg">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Total Bookmarks</span>
              <span class="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"/></svg>
              </span>
            </div>
            <p class="text-3xl font-black text-white mt-2">{{ stats?.totalBookmarks || 0 }}</p>
            <p class="text-xs text-zinc-500 mt-3">Shortlists saved across all students</p>
          </div>

          <!-- Taxonomy -->
          <div class="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-colors shadow-lg">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Taxonomy Stack</span>
              <span class="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
              </span>
            </div>
            <p class="text-3xl font-black text-white mt-2">{{ (stats?.totalTechnologies || 0) + (stats?.totalTags || 0) }}</p>
            <div class="flex items-center gap-2 mt-3 text-xs">
              <span class="font-bold text-amber-400">{{ stats?.totalTechnologies || 0 }} Tech</span>
              <span class="text-zinc-600">·</span>
              <span class="font-bold text-zinc-400">{{ stats?.totalTags || 0 }} Tags</span>
            </div>
          </div>
        </div>

        <!-- Quick Action Shortcuts -->
        <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
          <div class="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <h2 class="text-xl font-black text-white">Administrative Operations</h2>
              <p class="text-xs text-zinc-400 mt-1">Direct access to manage statements, curate tech stacks, and update platform taxonomy.</p>
            </div>
            <div class="flex flex-wrap items-center gap-3">
              <button
                (click)="openCreateProblemModal()"
                class="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-black text-xs font-black rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                Post New Problem
              </button>
              <button
                (click)="activeTab = 'technologies'"
                class="px-4 py-2.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-700/80 text-white text-xs font-bold rounded-xl transition-colors">
                Manage Tech Stack
              </button>
              <button
                (click)="activeTab = 'tags'"
                class="px-4 py-2.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-700/80 text-white text-xs font-bold rounded-xl transition-colors">
                Manage Tags
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 2: PROBLEMS MANAGEMENT -->
      <div *ngIf="activeTab === 'problems'" class="mt-6 space-y-6">
        <!-- Action Header & Filters -->
        <div class="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex flex-wrap items-center gap-3 flex-1">
            <!-- Search -->
            <div class="relative flex-1 min-w-[240px]">
              <input
                type="text"
                [(ngModel)]="problemSearchQuery"
                (ngModelChange)="onProblemSearchChange()"
                placeholder="Search statements by title..."
                class="w-full pl-9 pr-4 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
              <svg class="w-4 h-4 absolute left-3 top-3 text-zinc-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>

            <!-- Status Filter -->
            <select
              [(ngModel)]="problemStatusFilter"
              (ngModelChange)="loadProblems()"
              class="text-xs bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-300 font-bold focus:outline-none focus:border-amber-500">
              <option value="">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <button
            (click)="openCreateProblemModal()"
            class="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-black text-xs font-black rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Add Statement
          </button>
        </div>

        <!-- Problems Table -->
        <div class="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-zinc-950/80 border-b border-zinc-800 text-[11px] font-black uppercase tracking-wider text-zinc-400">
                  <th class="py-3.5 px-4">ID</th>
                  <th class="py-3.5 px-4">Problem Title & Domain</th>
                  <th class="py-3.5 px-4">Difficulty</th>
                  <th class="py-3.5 px-4">Type</th>
                  <th class="py-3.5 px-4">Status</th>
                  <th class="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-zinc-800/60 text-xs">
                <tr *ngFor="let p of problems" class="hover:bg-zinc-800/40 transition-colors">
                  <td class="py-3.5 px-4 font-mono font-bold text-amber-400/80">#{{ p.id }}</td>
                  <td class="py-3.5 px-4 max-w-md">
                    <a [routerLink]="['/problems', p.id]" target="_blank" class="font-bold text-white hover:text-amber-400 block line-clamp-1 transition-colors">
                      {{ p.title }}
                    </a>
                    <span class="text-[11px] text-zinc-400 font-medium">{{ p.domain }}</span>
                  </td>
                  <td class="py-3.5 px-4">
                    <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider"
                          [ngClass]="{
                            'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20': p.difficulty === 'BEGINNER',
                            'bg-amber-500/10 text-amber-400 border border-amber-500/20': p.difficulty === 'INTERMEDIATE',
                            'bg-rose-500/10 text-rose-400 border border-rose-500/20': p.difficulty === 'ADVANCED'
                          }">
                      {{ p.difficulty }}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 text-zinc-300 font-medium">
                    {{ formatProjectType(p.projectType) }}
                  </td>
                  <td class="py-3.5 px-4">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide"
                          [ngClass]="{
                            'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30': p.status === 'PUBLISHED',
                            'bg-amber-500/15 text-amber-400 border border-amber-500/30': p.status === 'DRAFT',
                            'bg-zinc-800 text-zinc-400 border border-zinc-700': p.status === 'ARCHIVED'
                          }">
                      {{ p.status }}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 text-right">
                    <div class="flex items-center justify-end gap-1.5">
                      <button
                        (click)="openEditProblemModal(p)"
                        title="Edit Problem"
                        class="px-2.5 py-1 text-zinc-300 hover:text-black hover:bg-amber-500 rounded-lg font-bold transition-all">
                        Edit
                      </button>
                      <button
                        *ngIf="p.status !== 'ARCHIVED'"
                        (click)="archiveProblem(p)"
                        title="Archive Problem"
                        class="px-2.5 py-1 text-amber-400 hover:text-black hover:bg-amber-400 rounded-lg font-bold transition-all">
                        Archive
                      </button>
                      <button
                        (click)="deleteProblem(p)"
                        title="Delete Problem"
                        class="px-2.5 py-1 text-rose-400 hover:text-white hover:bg-rose-600 rounded-lg font-bold transition-all">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>

                <tr *ngIf="problems.length === 0 && !loadingProblems">
                  <td colspan="6" class="py-12 text-center text-zinc-500">
                    No problem statements found matching criteria.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="p-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400 bg-zinc-950/50">
            <span>Showing {{ problems.length }} of {{ totalProblemsCount }} statements</span>
            <div class="flex items-center gap-2">
              <button
                (click)="problemPage = problemPage - 1; loadProblems()"
                [disabled]="problemPage === 0"
                class="px-3 py-1.5 border border-zinc-800 rounded-lg font-bold hover:bg-zinc-800 hover:border-amber-500/50 text-zinc-300 transition-colors disabled:opacity-40 disabled:hover:border-zinc-800 disabled:hover:bg-transparent">
                Previous
              </button>
              <span class="font-bold text-white px-1">Page {{ problemPage + 1 }}</span>
              <button
                (click)="problemPage = problemPage + 1; loadProblems()"
                [disabled]="(problemPage + 1) * problemPageSize >= totalProblemsCount"
                class="px-3 py-1.5 border border-zinc-800 rounded-lg font-bold hover:bg-zinc-800 hover:border-amber-500/50 text-zinc-300 transition-colors disabled:opacity-40 disabled:hover:border-zinc-800 disabled:hover:bg-transparent">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 3: TECHNOLOGIES MANAGEMENT -->
      <div *ngIf="activeTab === 'technologies'" class="mt-6 space-y-6">
        <!-- Add Technology Box -->
        <div class="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="max-w-md w-full flex items-center gap-2.5">
            <input
              type="text"
              [(ngModel)]="newTechName"
              placeholder="e.g. Flutter, PyTorch, GraphQL..."
              class="flex-1 px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
            />
            <button
              (click)="addTechnology()"
              [disabled]="!newTechName.trim()"
              class="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-black text-xs font-black rounded-xl shadow-lg shadow-amber-500/20 transition-all disabled:opacity-40">
              Add Technology
            </button>
          </div>
          <span class="text-xs text-zinc-400 font-medium">Total: {{ technologies.length }} curated technologies</span>
        </div>

        <!-- Tech Badges Grid -->
        <div class="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-xl">
          <div class="flex flex-wrap gap-2.5">
            <div *ngFor="let tech of technologies" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-950 text-zinc-200 text-xs font-bold border border-zinc-800 hover:border-amber-500/50 transition-colors">
              <span>{{ tech.name }}</span>
              <button
                (click)="deleteTechnology(tech)"
                title="Remove technology"
                class="text-zinc-500 hover:text-rose-400 transition-colors font-black text-sm leading-none ml-1">
                ×
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 4: TAGS MANAGEMENT -->
      <div *ngIf="activeTab === 'tags'" class="mt-6 space-y-6">
        <!-- Add Tag Box -->
        <div class="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="max-w-md w-full flex items-center gap-2.5">
            <input
              type="text"
              [(ngModel)]="newTagName"
              placeholder="e.g. Real-Time, IoT, Microservices..."
              class="flex-1 px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
            />
            <button
              (click)="addTag()"
              [disabled]="!newTagName.trim()"
              class="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-black text-xs font-black rounded-xl shadow-lg shadow-amber-500/20 transition-all disabled:opacity-40">
              Add Tag
            </button>
          </div>
          <span class="text-xs text-zinc-400 font-medium">Total: {{ tags.length }} curated tags</span>
        </div>

        <!-- Tags Grid -->
        <div class="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-xl">
          <div class="flex flex-wrap gap-2.5">
            <div *ngFor="let tag of tags" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-950 text-amber-400 text-xs font-mono font-bold border border-zinc-800 hover:border-amber-500/50 transition-colors">
              <span>#{{ tag.name }}</span>
              <button
                (click)="deleteTag(tag)"
                title="Remove tag"
                class="text-zinc-500 hover:text-rose-400 transition-colors font-black text-sm leading-none ml-1">
                ×
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CREATE / EDIT PROBLEM MODAL -->
    <div *ngIf="showProblemModal" class="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-zinc-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-zinc-800">
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80">
          <div>
            <h2 class="text-lg font-black text-white">
              {{ editingProblemId ? 'Edit Problem Statement' : 'Create New Problem Statement' }}
            </h2>
            <p class="text-xs text-zinc-400">Provide detailed real-world problem context for students.</p>
          </div>
          <button (click)="closeProblemModal()" class="text-zinc-400 hover:text-white text-lg font-bold">✕</button>
        </div>

        <!-- Modal Form Body -->
        <div class="p-6 overflow-y-auto flex-1 space-y-5 text-xs text-zinc-200">
          <!-- Title -->
          <div>
            <label class="block font-bold uppercase tracking-wider text-[11px] text-zinc-400 mb-1.5">Title *</label>
            <input
              type="text"
              [(ngModel)]="problemForm.title"
              placeholder="e.g. Cold-Chain Monitoring System for Rural Vaccine Distribution"
              class="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block font-bold uppercase tracking-wider text-[11px] text-zinc-400 mb-1.5">Description *</label>
            <textarea
              rows="3"
              [(ngModel)]="problemForm.description"
              placeholder="Describe the real-world operational challenge in clear detail..."
              class="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs"
            ></textarea>
          </div>

          <!-- Row: Domain, Difficulty, Project Type, Status -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label class="block font-bold uppercase tracking-wider text-[11px] text-zinc-400 mb-1.5">Domain *</label>
              <select
                [(ngModel)]="problemForm.domain"
                class="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-500 text-xs">
                <option *ngFor="let d of domainOptions" [value]="d">{{ d }}</option>
              </select>
            </div>

            <div>
              <label class="block font-bold uppercase tracking-wider text-[11px] text-zinc-400 mb-1.5">Difficulty *</label>
              <select
                [(ngModel)]="problemForm.difficulty"
                class="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-500 text-xs">
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>

            <div>
              <label class="block font-bold uppercase tracking-wider text-[11px] text-zinc-400 mb-1.5">Project Type *</label>
              <select
                [(ngModel)]="problemForm.projectType"
                class="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-500 text-xs">
                <option value="HACKATHON">Hackathon</option>
                <option value="MINI_PROJECT">Mini Project</option>
                <option value="MAJOR_PROJECT">Major Project</option>
                <option value="FINAL_YEAR_PROJECT">Final Year Project</option>
              </select>
            </div>

            <div>
              <label class="block font-bold uppercase tracking-wider text-[11px] text-zinc-400 mb-1.5">Status *</label>
              <select
                [(ngModel)]="problemForm.status"
                class="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-amber-500 text-xs">
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>

          <!-- Impact -->
          <div>
            <label class="block font-bold uppercase tracking-wider text-[11px] text-zinc-400 mb-1.5">Real-World Impact</label>
            <textarea
              rows="2"
              [(ngModel)]="problemForm.impact"
              placeholder="Why this matters, stakeholders affected, scale of benefit..."
              class="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs"
            ></textarea>
          </div>

          <!-- Solution Direction -->
          <div>
            <label class="block font-bold uppercase tracking-wider text-[11px] text-zinc-400 mb-1.5">Architecture & Solution Direction</label>
            <textarea
              rows="2"
              [(ngModel)]="problemForm.solutionDirection"
              placeholder="Suggested architecture, pipeline design, protocol suggestions..."
              class="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs"
            ></textarea>
          </div>

          <!-- Expected Outcome -->
          <div>
            <label class="block font-bold uppercase tracking-wider text-[11px] text-zinc-400 mb-1.5">Expected Deliverables & Outcome</label>
            <textarea
              rows="2"
              [(ngModel)]="problemForm.expectedOutcome"
              placeholder="Working prototype, dashboards, CI/CD deployment, documentation..."
              class="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-xs"
            ></textarea>
          </div>

          <!-- Technologies Selector -->
          <div>
            <label class="block font-bold uppercase tracking-wider text-[11px] text-zinc-400 mb-1.5">Technologies (Select relevant)</label>
            <div class="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2.5 border border-zinc-800 rounded-xl bg-zinc-950">
              <button
                *ngFor="let tech of technologies"
                type="button"
                (click)="toggleTechSelection(tech.id)"
                [class.bg-amber-500]="isTechSelected(tech.id)"
                [class.text-black]="isTechSelected(tech.id)"
                [class.border-amber-500]="isTechSelected(tech.id)"
                [class.font-extrabold]="isTechSelected(tech.id)"
                [class.bg-zinc-900]="!isTechSelected(tech.id)"
                [class.text-zinc-300]="!isTechSelected(tech.id)"
                [class.border-zinc-800]="!isTechSelected(tech.id)"
                class="px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-colors">
                {{ tech.name }}
              </button>
            </div>
          </div>

          <!-- Tags Selector -->
          <div>
            <label class="block font-bold uppercase tracking-wider text-[11px] text-zinc-400 mb-1.5">Tags (Select relevant)</label>
            <div class="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2.5 border border-zinc-800 rounded-xl bg-zinc-950">
              <button
                *ngFor="let tag of tags"
                type="button"
                (click)="toggleTagSelection(tag.id)"
                [class.bg-amber-500]="isTagSelected(tag.id)"
                [class.text-black]="isTagSelected(tag.id)"
                [class.border-amber-500]="isTagSelected(tag.id)"
                [class.font-extrabold]="isTagSelected(tag.id)"
                [class.bg-zinc-900]="!isTagSelected(tag.id)"
                [class.text-zinc-400]="!isTagSelected(tag.id)"
                [class.border-zinc-800]="!isTagSelected(tag.id)"
                class="px-2.5 py-1 text-[11px] font-mono font-medium rounded-lg border transition-colors">
                #{{ tag.name }}
              </button>
            </div>
          </div>

          <div *ngIf="formError" class="p-3.5 bg-rose-950/40 border border-rose-800/60 text-rose-300 rounded-xl font-medium">
            {{ formError }}
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-4 border-t border-zinc-800 flex items-center justify-end gap-3 bg-zinc-950/80">
          <button
            (click)="closeProblemModal()"
            class="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors">
            Cancel
          </button>
          <button
            (click)="saveProblem()"
            [disabled]="savingProblem"
            class="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-black text-xs font-black rounded-xl shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50">
            {{ savingProblem ? 'Saving...' : (editingProblemId ? 'Update Statement' : 'Create Statement') }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly problemService = inject(ProblemService);
  private readonly cdr = inject(ChangeDetectorRef);

  activeTab: AdminTab = 'overview';
  stats: AdminStats | null = null;
  notification: { message: string; type: 'success' | 'error' } | null = null;

  // Problems state
  problems: Problem[] = [];
  totalProblemsCount = 0;
  problemPage = 0;
  problemPageSize = 10;
  problemSearchQuery = '';
  problemStatusFilter = '';
  loadingProblems = false;

  // Taxonomy state
  technologies: Technology[] = [];
  tags: Tag[] = [];
  newTechName = '';
  newTagName = '';

  // Problem Modal state
  showProblemModal = false;
  editingProblemId: number | null = null;
  savingProblem = false;
  formError: string | null = null;

  domainOptions = [
    'Healthcare',
    'FinTech',
    'Civic Tech',
    'EdTech',
    'CleanTech',
    'Cybersecurity',
    'Agriculture',
    'Logistics',
    'Sustainability',
    'Cloud Native',
    'Open Source'
  ];

  problemForm = {
    title: '',
    description: '',
    domain: 'Healthcare',
    difficulty: 'INTERMEDIATE',
    projectType: 'MAJOR_PROJECT',
    status: 'PUBLISHED' as ProblemStatus,
    impact: '',
    solutionDirection: '',
    expectedOutcome: '',
    technologyIds: [] as number[],
    tagIds: [] as number[]
  };

  ngOnInit(): void {
    this.loadStats();
    this.loadProblems();
    this.loadTaxonomy();
  }

  loadStats(): void {
    this.adminService.getStats().subscribe({
      next: (s) => {
        this.stats = s;
        this.cdr.markForCheck();
      },
      error: () => this.showNotification('Failed to load platform stats', 'error')
    });
  }

  loadTaxonomy(): void {
    this.problemService.getTechnologies().subscribe({
      next: (techs) => {
        this.technologies = techs;
        this.cdr.markForCheck();
      },
      error: () => {}
    });
    this.problemService.getTags().subscribe({
      next: (tags) => {
        this.tags = tags;
        this.cdr.markForCheck();
      },
      error: () => {}
    });
  }

  loadProblems(): void {
    this.loadingProblems = true;
    this.problemService.getProblems({
      keyword: this.problemSearchQuery || undefined,
      status: this.problemStatusFilter || undefined,
      page: this.problemPage,
      size: this.problemPageSize,
      sortBy: 'createdAt',
      sortDir: 'DESC'
    }).subscribe({
      next: (res) => {
        this.problems = res.content;
        this.totalProblemsCount = res.totalElements;
        this.loadingProblems = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loadingProblems = false;
        this.showNotification('Failed to load problem statements', 'error');
        this.cdr.markForCheck();
      }
    });
  }

  onProblemSearchChange(): void {
    this.problemPage = 0;
    this.loadProblems();
  }

  openCreateProblemModal(): void {
    this.editingProblemId = null;
    this.problemForm = {
      title: '',
      description: '',
      domain: 'Healthcare',
      difficulty: 'INTERMEDIATE',
      projectType: 'MAJOR_PROJECT',
      status: 'PUBLISHED',
      impact: '',
      solutionDirection: '',
      expectedOutcome: '',
      technologyIds: [],
      tagIds: []
    };
    this.formError = null;
    this.showProblemModal = true;
  }

  openEditProblemModal(p: Problem): void {
    this.editingProblemId = p.id;
    this.problemForm = {
      title: p.title,
      description: p.description,
      domain: p.domain,
      difficulty: p.difficulty,
      projectType: p.projectType,
      status: p.status,
      impact: p.impact || '',
      solutionDirection: p.solutionDirection || '',
      expectedOutcome: p.expectedOutcome || '',
      technologyIds: p.technologies ? p.technologies.map(t => t.id) : [],
      tagIds: p.tags ? p.tags.map(t => t.id) : []
    };
    this.formError = null;
    this.showProblemModal = true;
  }

  closeProblemModal(): void {
    this.showProblemModal = false;
    this.formError = null;
  }

  isTechSelected(id: number): boolean {
    return this.problemForm.technologyIds.includes(id);
  }

  toggleTechSelection(id: number): void {
    const idx = this.problemForm.technologyIds.indexOf(id);
    if (idx > -1) {
      this.problemForm.technologyIds.splice(idx, 1);
    } else {
      this.problemForm.technologyIds.push(id);
    }
  }

  isTagSelected(id: number): boolean {
    return this.problemForm.tagIds.includes(id);
  }

  toggleTagSelection(id: number): void {
    const idx = this.problemForm.tagIds.indexOf(id);
    if (idx > -1) {
      this.problemForm.tagIds.splice(idx, 1);
    } else {
      this.problemForm.tagIds.push(id);
    }
  }

  saveProblem(): void {
    if (!this.problemForm.title || this.problemForm.title.trim().length < 5) {
      this.formError = 'Title is required and must be at least 5 characters.';
      return;
    }
    if (!this.problemForm.description || !this.problemForm.description.trim()) {
      this.formError = 'Description is required.';
      return;
    }

    this.savingProblem = true;
    this.formError = null;

    const payload = {
      ...this.problemForm,
      title: this.problemForm.title.trim(),
      description: this.problemForm.description.trim()
    };

    if (this.editingProblemId) {
      this.problemService.updateProblem(this.editingProblemId, payload).subscribe({
        next: () => {
          this.savingProblem = false;
          this.closeProblemModal();
          this.showNotification('Problem updated successfully!', 'success');
          this.loadProblems();
          this.loadStats();
        },
        error: (err) => {
          this.savingProblem = false;
          this.formError = err?.error?.message || 'Failed to update problem.';
        }
      });
    } else {
      this.problemService.createProblem(payload).subscribe({
        next: () => {
          this.savingProblem = false;
          this.closeProblemModal();
          this.showNotification('New problem created successfully!', 'success');
          this.loadProblems();
          this.loadStats();
        },
        error: (err) => {
          this.savingProblem = false;
          this.formError = err?.error?.message || 'Failed to create problem.';
        }
      });
    }
  }

  archiveProblem(p: Problem): void {
    if (confirm(`Are you sure you want to archive "${p.title}"?`)) {
      this.problemService.archiveProblem(p.id).subscribe({
        next: () => {
          this.showNotification(`Problem #${p.id} archived.`, 'success');
          this.loadProblems();
          this.loadStats();
        },
        error: () => this.showNotification('Failed to archive problem.', 'error')
      });
    }
  }

  deleteProblem(p: Problem): void {
    if (confirm(`Permanently delete "${p.title}"? This cannot be undone.`)) {
      this.problemService.deleteProblem(p.id).subscribe({
        next: () => {
          this.showNotification(`Problem #${p.id} deleted.`, 'success');
          this.loadProblems();
          this.loadStats();
        },
        error: () => this.showNotification('Failed to delete problem.', 'error')
      });
    }
  }

  addTechnology(): void {
    if (!this.newTechName.trim()) return;
    this.adminService.createTechnology(this.newTechName.trim()).subscribe({
      next: (created) => {
        this.showNotification(`Technology "${created.name}" added.`, 'success');
        this.newTechName = '';
        this.loadTaxonomy();
        this.loadStats();
      },
      error: (err) => this.showNotification(err?.error?.message || 'Failed to add technology.', 'error')
    });
  }

  deleteTechnology(tech: Technology): void {
    if (confirm(`Delete technology "${tech.name}"? This removes it from all associated problems.`)) {
      this.adminService.deleteTechnology(tech.id).subscribe({
        next: () => {
          this.showNotification(`Technology "${tech.name}" removed.`, 'success');
          this.loadTaxonomy();
          this.loadStats();
        },
        error: (err) => this.showNotification(err?.error?.message || 'Failed to delete technology.', 'error')
      });
    }
  }

  addTag(): void {
    if (!this.newTagName.trim()) return;
    this.adminService.createTag(this.newTagName.trim()).subscribe({
      next: (created) => {
        this.showNotification(`Tag "#${created.name}" added.`, 'success');
        this.newTagName = '';
        this.loadTaxonomy();
        this.loadStats();
      },
      error: (err) => this.showNotification(err?.error?.message || 'Failed to add tag.', 'error')
    });
  }

  deleteTag(tag: Tag): void {
    if (confirm(`Delete tag "#${tag.name}"? This removes it from all associated problems.`)) {
      this.adminService.deleteTag(tag.id).subscribe({
        next: () => {
          this.showNotification(`Tag "#${tag.name}" removed.`, 'success');
          this.loadTaxonomy();
          this.loadStats();
        },
        error: (err) => this.showNotification(err?.error?.message || 'Failed to delete tag.', 'error')
      });
    }
  }

  formatProjectType(type: string): string {
    switch (type) {
      case 'HACKATHON': return 'Hackathon';
      case 'MINI_PROJECT': return 'Mini Project';
      case 'MAJOR_PROJECT': return 'Major Project';
      case 'FINAL_YEAR_PROJECT': return 'Final Year';
      default: return type;
    }
  }

  private showNotification(message: string, type: 'success' | 'error'): void {
    this.notification = { message, type };
    this.cdr.markForCheck();
    setTimeout(() => {
      if (this.notification?.message === message) {
        this.notification = null;
        this.cdr.markForCheck();
      }
    }, 5000);
  }
}
