/**
 * HeroSection Component Tests
 *
 * Feature: 008-homepage-integration
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HeroSection } from '../HeroSection';

// Wrapper component to provide router context
const RouterWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('HeroSection', () => {
  it('renders without crashing', () => {
    render(<HeroSection />, { wrapper: RouterWrapper });
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('displays the headline text', () => {
    render(<HeroSection />, { wrapper: RouterWrapper });
    expect(screen.getByText(/Find your next bestselling spa product/i)).toBeInTheDocument();
  });

  it('displays the subheadline text', () => {
    render(<HeroSection />, { wrapper: RouterWrapper });
    expect(
      screen.getByText(/Shop premium skincare from independent brands worldwide/i)
    ).toBeInTheDocument();
  });

  it('displays the CTA button with correct text', () => {
    render(<HeroSection />, { wrapper: RouterWrapper });
    const button = screen.getByRole('button', { name: /Start browsing/i });
    expect(button).toBeInTheDocument();
  });

  it('CTA button links to products page', () => {
    render(<HeroSection />, { wrapper: RouterWrapper });
    const link = screen.getByRole('link', { name: /Start browsing/i });
    expect(link).toHaveAttribute('href', '/app/products');
  });

  it('renders background video element', () => {
    const { container } = render(<HeroSection />, { wrapper: RouterWrapper });
    const video = container.querySelector('video');
    expect(video).toBeInTheDocument();
    expect(video).toHaveProperty('autoplay', true);
    expect(video).toHaveProperty('muted', true);
    expect(video).toHaveProperty('loop', true);
    expect(video).toHaveAttribute('playsinline');
  });

  it('video has poster image', () => {
    const { container } = render(<HeroSection />, { wrapper: RouterWrapper });
    const video = container.querySelector('video');
    expect(video).toHaveAttribute('poster', '/assets/hero-background.jpg');
  });

  it('renders video sources with correct formats', () => {
    const { container } = render(<HeroSection />, { wrapper: RouterWrapper });
    const mp4Source = container.querySelector('source[type="video/mp4"]');
    const webmSource = container.querySelector('source[type="video/webm"]');

    expect(mp4Source).toBeInTheDocument();
    expect(mp4Source).toHaveAttribute('src', '/assets/hero-video.mp4');
    expect(webmSource).toBeInTheDocument();
    expect(webmSource).toHaveAttribute('src', '/assets/hero-video.webm');
  });

  it('renders fallback image for browsers without video support', () => {
    render(<HeroSection />, { wrapper: RouterWrapper });
    const image = screen.getByAltText(/Premium spa treatments and skincare products/i);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/assets/hero-background.jpg');
  });

  it('has correct ARIA attributes', () => {
    render(<HeroSection />, { wrapper: RouterWrapper });
    const banner = screen.getByRole('banner');
    expect(banner).toHaveAttribute('aria-label', 'Hero banner');
  });

  it('applies responsive height classes', () => {
    render(<HeroSection />, { wrapper: RouterWrapper });
    const banner = screen.getByRole('banner');
    expect(banner).toHaveClass('h-[52vh]', 'min-h-[400px]');
  });

  it('applies rounded corners', () => {
    render(<HeroSection />, { wrapper: RouterWrapper });
    const banner = screen.getByRole('banner');
    expect(banner).toHaveClass('rounded-3xl');
  });

  it('displays the Jade logo', () => {
    render(<HeroSection />, { wrapper: RouterWrapper });
    const logo = screen.getByAltText('Jade Software');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/assets/jade-logo.png');
  });
});
