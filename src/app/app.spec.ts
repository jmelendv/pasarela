import '@angular/compiler';
import { describe, expect, it } from 'vitest';
import { App } from './app';

describe('App', () => {
  it('should create the app class', () => {
    const app = new App();

    expect(app).toBeTruthy();
  });

  it('should create App instances of the expected type', () => {
    const app = new App();

    expect(app).toBeInstanceOf(App);
  });
});
