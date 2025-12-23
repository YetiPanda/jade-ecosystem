import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Label } from '../src/components/Label';

describe('Label', () => {
  it('renders children correctly', () => {
    render(<Label>Test Label</Label>);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('applies correct base styles', () => {
    render(<Label>Styled Label</Label>);
    const label = screen.getByText('Styled Label');
    expect(label).toHaveClass('flex', 'items-center', 'gap-2', 'text-sm', 'leading-none', 'font-medium', 'select-none');
  });

  it('renders with data-slot attribute', () => {
    render(<Label>Slotted</Label>);
    const label = screen.getByText('Slotted');
    expect(label).toHaveAttribute('data-slot', 'label');
  });

  it('merges custom className with default styles', () => {
    render(<Label className="custom-label">Custom</Label>);
    const label = screen.getByText('Custom');
    expect(label).toHaveClass('custom-label');
    expect(label).toHaveClass('flex', 'items-center');
  });

  it('forwards htmlFor prop to Radix Label', () => {
    render(<Label htmlFor="test-input">Input Label</Label>);
    const label = screen.getByText('Input Label');
    expect(label).toHaveAttribute('for', 'test-input');
  });

  it('forwards additional props to Radix Label element', () => {
    render(<Label data-testid="label-test">Props</Label>);
    expect(screen.getByTestId('label-test')).toBeInTheDocument();
  });

  it('renders with icon children', () => {
    render(
      <Label>
        <svg data-testid="label-icon" />
        Label with Icon
      </Label>
    );
    expect(screen.getByTestId('label-icon')).toBeInTheDocument();
    expect(screen.getByText('Label with Icon')).toBeInTheDocument();
  });

  it('associates with input element using htmlFor', () => {
    render(
      <div>
        <Label htmlFor="email">Email</Label>
        <input id="email" type="email" />
      </div>
    );
    const label = screen.getByText('Email');
    const input = document.getElementById('email');
    expect(label).toHaveAttribute('for', 'email');
    expect(input).toBeInTheDocument();
  });

  it('supports Radix Label click behavior', () => {
    render(
      <div>
        <Label htmlFor="checkbox">
          <input id="checkbox" type="checkbox" />
          Checkbox Label
        </Label>
      </div>
    );
    const label = screen.getByText('Checkbox Label');
    expect(label).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });
});
