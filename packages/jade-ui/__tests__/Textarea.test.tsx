import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Textarea } from '../src/components/Textarea';

describe('Textarea', () => {
  it('renders textarea element', () => {
    render(<Textarea />);
    const textarea = screen.getByRole('textbox');
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('renders with placeholder text', () => {
    render(<Textarea placeholder="Enter text here" />);
    expect(screen.getByPlaceholderText('Enter text here')).toBeInTheDocument();
  });

  it('applies correct base styles', () => {
    render(<Textarea data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveClass(
      'resize-none',
      'border-input',
      'flex',
      'min-h-16',
      'w-full',
      'rounded-md',
      'border',
      'bg-input-background',
      'px-3',
      'py-2'
    );
  });

  it('renders with data-slot attribute', () => {
    render(<Textarea data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveAttribute('data-slot', 'textarea');
  });

  it('merges custom className with default styles', () => {
    render(<Textarea className="custom-textarea" data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveClass('custom-textarea');
    expect(textarea).toHaveClass('resize-none', 'w-full');
  });

  it('forwards additional props to textarea element', () => {
    render(<Textarea data-testid="textarea" rows={5} maxLength={100} />);
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveAttribute('rows', '5');
    expect(textarea).toHaveAttribute('maxlength', '100');
  });

  it('handles user input correctly', async () => {
    const user = userEvent.setup();
    render(<Textarea data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');

    await user.type(textarea, 'Test input');
    expect(textarea).toHaveValue('Test input');
  });

  it('handles disabled state', () => {
    render(<Textarea disabled data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toBeDisabled();
    expect(textarea).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50');
  });

  it('handles aria-invalid state', () => {
    render(<Textarea aria-invalid={true} data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
  });

  it('supports controlled component pattern', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Textarea value="Initial" onChange={() => {}} data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea') as HTMLTextAreaElement;

    expect(textarea.value).toBe('Initial');

    rerender(<Textarea value="Updated" onChange={() => {}} data-testid="textarea" />);
    expect(textarea.value).toBe('Updated');
  });

  it('supports uncontrolled component pattern', async () => {
    const user = userEvent.setup();
    render(<Textarea defaultValue="Default text" data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');

    expect(textarea).toHaveValue('Default text');
    await user.clear(textarea);
    await user.type(textarea, 'New text');
    expect(textarea).toHaveValue('New text');
  });

  it('applies focus styles on focus', async () => {
    const user = userEvent.setup();
    render(<Textarea data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');

    await user.click(textarea);
    expect(textarea).toHaveFocus();
  });

  it('supports required attribute', () => {
    render(<Textarea required data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toBeRequired();
  });

  it('supports name attribute for forms', () => {
    render(<Textarea name="description" data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toHaveAttribute('name', 'description');
  });
});
