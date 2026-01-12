import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly themeSignal = signal<ThemeMode>('light');

  readonly theme = this.themeSignal.asReadonly();

  constructor() {
    this.setTheme('light');
  }

  toggle(): void {
    const next = this.themeSignal() === 'light' ? 'dark' : 'light';
    this.setTheme(next);
  }

  setTheme(theme: ThemeMode): void {
    this.themeSignal.set(theme);
    document.documentElement.dataset['theme'] = theme;
  }
}
