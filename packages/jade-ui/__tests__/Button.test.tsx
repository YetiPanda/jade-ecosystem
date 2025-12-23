import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../src/components/Button';

describe('Button', () => {
  describe('Rendering', () => {
    it('should render with default variant and size', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button', { name: 'Click me' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('data-slot', 'button');
    });

    it('should render children correctly', () => {
      render(<Button>Test Content</Button>);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<Button className="custom-class">Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });
  });

  describe('Variants', () => {
    it('should render primary variant', () => {
      const { container } = render(<Button variant="primary">Primary</Button>);
      const button = container.querySelector('button');
      expect(button?.className).toContain('bg-primary');
    });

    it('should render secondary variant', () => {
      const { container } = render(<Button variant="secondary">Secondary</Button>);
      const button = container.querySelector('button');
      expect(button?.className).toContain('bg-secondary');
    });

    it('should render destructive variant', () => {
      const { container } = render(<Button variant="destructive">Delete</Button>);
      const button = container.querySelector('button');
      expect(button?.className).toContain('bg-destructive');
    });

    it('should render outline variant', () => {
      const { container } = render(<Button variant="outline">Outline</Button>);
      const button = container.querySelector('button');
      expect(button?.className).toContain('border');
    });

    it('should render ghost variant', () => {
      const { container } = render(<Button variant="ghost">Ghost</Button>);
      const button = container.querySelector('button');
      expect(button?.className).toContain('hover:bg-accent');
    });

    it('should render link variant', () => {
      const { container } = render(<Button variant="link">Link</Button>);
      const button = container.querySelector('button');
      expect(button?.className).toContain('underline-offset-4');
    });
  });

  describe('Sizes', () => {
    it('should render small size', () => {
      const { container } = render(<Button size="sm">Small</Button>);
      const button = container.querySelector('button');
      expect(button?.className).toContain('h-8');
    });

    it('should render default size', () => {
      const { container } = render(<Button size="default">Default</Button>);
      const button = container.querySelector('button');
      expect(button?.className).toContain('h-9');
    });

    it('should render large size', () => {
      const { container } = render(<Button size="lg">Large</Button>);
      const button = container.querySelector('button');
      expect(button?.className).toContain('h-10');
    });

    it('should render icon size', () => {
      const { container } = render(<Button size="icon">Icon</Button>);
      const button = container.querySelector('button');
      expect(button?.className).toContain('size-9');
    });
  });

  describe('Loading State', () => {
    it('should show loading spinner when isLoading is true', () => {
      render(<Button isLoading>Loading</Button>);
      const button = screen.getByRole('button');
      const spinner = button.querySelector('svg.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should disable button when isLoading is true', () => {
      render(<Button isLoading>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should still show children text when loading', () => {
      render(<Button isLoading>Processing</Button>);
      expect(screen.getByText('Processing')).toBeInTheDocument();
    });

    it('should not show spinner when isLoading is false', () => {
      render(<Button isLoading={false}>Normal</Button>);
      const button = screen.getByRole('button');
      const spinner = button.querySelector('svg.animate-spin');
      expect(spinner).not.toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should have opacity-50 class when disabled', () => {
      const { container } = render(<Button disabled>Disabled</Button>);
      const button = container.querySelector('button');
      expect(button?.className).toContain('disabled:opacity-50');
    });

    it('should not be clickable when disabled', async () => {
      const handleClick = vi.fn();
      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>
      );
      const button = screen.getByRole('button');
      await userEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Click Handler', () => {
    it('should call onClick when clicked', async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      const button = screen.getByRole('button');
      await userEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', async () => {
      const handleClick = vi.fn();
      render(
        <Button disabled onClick={handleClick}>
          Click me
        </Button>
      );
      const button = screen.getByRole('button');
      await userEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should not call onClick when loading', async () => {
      const handleClick = vi.fn();
      render(
        <Button isLoading onClick={handleClick}>
          Click me
        </Button>
      );
      const button = screen.getByRole('button');
      await userEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('AsChild Prop', () => {
    it('should render as child component when asChild is true', () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      );
      const link = screen.getByRole('link', { name: 'Link Button' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
    });

    it('should apply button styles to child when asChild is true', () => {
      const { container } = render(
        <Button asChild variant="primary" size="lg">
          <a href="/test">Link Button</a>
        </Button>
      );
      const link = container.querySelector('a');
      expect(link?.className).toContain('bg-primary');
      expect(link?.className).toContain('h-10');
    });
  });

  describe('HTML Attributes', () => {
    it('should pass through native button attributes', () => {
      render(
        <Button type="submit" name="submit-btn" data-testid="test-button">
          Submit
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).toHaveAttribute('name', 'submit-btn');
      expect(button).toHaveAttribute('data-testid', 'test-button');
    });

    it('should support aria attributes', () => {
      render(
        <Button aria-label="Close dialog" aria-describedby="dialog-desc">
          ×
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Close dialog');
      expect(button).toHaveAttribute('aria-describedby', 'dialog-desc');
    });
  });

  describe('Icon Buttons', () => {
    it('should render with SVG icon', () => {
      render(
        <Button size="icon">
          <svg data-testid="icon" width="16" height="16" />
        </Button>
      );
      const icon = screen.getByTestId('icon');
      expect(icon).toBeInTheDocument();
    });

    it('should apply proper size class for icon variant', () => {
      const { container } = render(
        <Button size="icon">
          <svg width="16" height="16" />
        </Button>
      );
      const button = container.querySelector('button');
      expect(button?.className).toContain('size-9');
    });
  });
});
