import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Alert, AlertTitle, AlertDescription } from '../src/components/Alert';

describe('Alert', () => {
  it('renders children correctly', () => {
    render(<Alert>Alert content</Alert>);
    expect(screen.getByText('Alert content')).toBeInTheDocument();
  });

  it('applies default variant styles', () => {
    render(<Alert>Default Alert</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-card', 'text-card-foreground');
  });

  it('applies destructive variant styles', () => {
    render(<Alert variant="destructive">Destructive Alert</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('text-destructive', 'bg-card');
  });

  it('merges custom className with default styles', () => {
    render(<Alert className="custom-alert">Custom</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('custom-alert');
    expect(alert).toHaveClass('relative', 'w-full');
  });

  it('renders with data-slot attribute', () => {
    render(<Alert>Slotted</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('data-slot', 'alert');
  });

  it('forwards additional props to div element', () => {
    render(<Alert data-testid="alert-test">Props</Alert>);
    expect(screen.getByTestId('alert-test')).toBeInTheDocument();
  });

  it('renders with icon and applies grid layout', () => {
    render(
      <Alert>
        <svg data-testid="alert-icon" />
        <div>Content with icon</div>
      </Alert>
    );
    expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('grid');
  });
});

describe('AlertTitle', () => {
  it('renders title text correctly', () => {
    render(<AlertTitle>Alert Title</AlertTitle>);
    expect(screen.getByText('Alert Title')).toBeInTheDocument();
  });

  it('renders as div element by default', () => {
    render(<AlertTitle>Title</AlertTitle>);
    const title = screen.getByText('Title');
    expect(title.tagName).toBe('DIV');
  });

  it('applies correct styles', () => {
    render(<AlertTitle>Styled Title</AlertTitle>);
    const title = screen.getByText('Styled Title');
    expect(title).toHaveClass('col-start-2', 'line-clamp-1', 'min-h-4', 'font-medium', 'tracking-tight');
  });

  it('has data-slot attribute', () => {
    render(<AlertTitle>Slotted Title</AlertTitle>);
    const title = screen.getByText('Slotted Title');
    expect(title).toHaveAttribute('data-slot', 'alert-title');
  });

  it('merges custom className', () => {
    render(<AlertTitle className="custom-title">Custom</AlertTitle>);
    const title = screen.getByText('Custom');
    expect(title).toHaveClass('custom-title', 'font-medium');
  });
});

describe('AlertDescription', () => {
  it('renders description text correctly', () => {
    render(<AlertDescription>Alert description text</AlertDescription>);
    expect(screen.getByText('Alert description text')).toBeInTheDocument();
  });

  it('renders as div element', () => {
    render(<AlertDescription>Description</AlertDescription>);
    const desc = screen.getByText('Description');
    expect(desc.tagName).toBe('DIV');
  });

  it('applies correct styles', () => {
    render(<AlertDescription>Styled Description</AlertDescription>);
    const desc = screen.getByText('Styled Description');
    expect(desc).toHaveClass('text-muted-foreground', 'col-start-2', 'text-sm');
  });

  it('has data-slot attribute', () => {
    render(<AlertDescription>Slotted Description</AlertDescription>);
    const desc = screen.getByText('Slotted Description');
    expect(desc).toHaveAttribute('data-slot', 'alert-description');
  });

  it('merges custom className', () => {
    render(<AlertDescription className="custom-desc">Custom</AlertDescription>);
    const desc = screen.getByText('Custom');
    expect(desc).toHaveClass('custom-desc', 'text-sm');
  });
});

describe('Alert composition', () => {
  it('renders complete alert with title and description', () => {
    render(
      <Alert>
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>This is a warning message</AlertDescription>
      </Alert>
    );
    expect(screen.getByText('Warning')).toBeInTheDocument();
    expect(screen.getByText('This is a warning message')).toBeInTheDocument();
  });

  it('renders destructive alert with all parts', () => {
    render(
      <Alert variant="destructive">
        <svg data-testid="error-icon" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>An error occurred</AlertDescription>
      </Alert>
    );
    expect(screen.getByTestId('error-icon')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('An error occurred')).toBeInTheDocument();
  });
});
