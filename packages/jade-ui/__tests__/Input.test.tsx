import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../src/components/Input';

describe('Input', () => {
  describe('Rendering', () => {
    it('should render an input element', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('data-slot', 'input');
    });

    it('should apply default classes', () => {
      const { container } = render(<Input />);
      const input = container.querySelector('input');
      expect(input?.className).toContain('flex');
      expect(input?.className).toContain('h-9');
      expect(input?.className).toContain('w-full');
      expect(input?.className).toContain('rounded-md');
      expect(input?.className).toContain('border');
    });

    it('should apply custom className', () => {
      render(<Input className="custom-input" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-input');
    });
  });

  describe('Input Types', () => {
    it('should render text input by default', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      // Note: HTML inputs default to type="text" without explicit attribute
    });

    it('should render password input', () => {
      render(<Input type="password" />);
      const input = document.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
    });

    it('should render email input', () => {
      render(<Input type="email" />);
      const input = document.querySelector('input[type="email"]');
      expect(input).toBeInTheDocument();
    });

    it('should render number input', () => {
      render(<Input type="number" />);
      const input = document.querySelector('input[type="number"]');
      expect(input).toBeInTheDocument();
    });

    it('should render search input', () => {
      render(<Input type="search" />);
      const input = document.querySelector('input[type="search"]');
      expect(input).toBeInTheDocument();
    });

    it('should render tel input', () => {
      render(<Input type="tel" />);
      const input = document.querySelector('input[type="tel"]');
      expect(input).toBeInTheDocument();
    });

    it('should render url input', () => {
      render(<Input type="url" />);
      const input = document.querySelector('input[type="url"]');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Placeholder', () => {
    it('should display placeholder text', () => {
      render(<Input placeholder="Enter your name" />);
      const input = screen.getByPlaceholderText('Enter your name');
      expect(input).toBeInTheDocument();
    });

    it('should have placeholder styling classes', () => {
      const { container } = render(<Input placeholder="Placeholder" />);
      const input = container.querySelector('input');
      expect(input?.className).toContain('placeholder:text-muted-foreground');
    });
  });

  describe('Value and onChange', () => {
    it('should display value', () => {
      render(<Input value="test value" readOnly />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('test value');
    });

    it('should call onChange when value changes', async () => {
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} />);
      const input = screen.getByRole('textbox');
      await userEvent.type(input, 'hello');
      expect(handleChange).toHaveBeenCalled();
      expect(handleChange).toHaveBeenCalledTimes(5); // once per character
    });

    it('should update value on user input', async () => {
      render(<Input defaultValue="" />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      await userEvent.type(input, 'new text');
      expect(input.value).toBe('new text');
    });
  });

  describe('Disabled State', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Input disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('should have disabled styling classes', () => {
      const { container } = render(<Input disabled />);
      const input = container.querySelector('input');
      expect(input?.className).toContain('disabled:opacity-50');
      expect(input?.className).toContain('disabled:cursor-not-allowed');
    });

    it('should not accept input when disabled', async () => {
      render(<Input disabled defaultValue="" />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      await userEvent.type(input, 'text');
      expect(input.value).toBe(''); // Value should not change
    });
  });

  describe('Required and Validation', () => {
    it('should support required attribute', () => {
      render(<Input required />);
      const input = screen.getByRole('textbox');
      expect(input).toBeRequired();
    });

    it('should support aria-invalid attribute', () => {
      render(<Input aria-invalid="true" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('should have error styling classes for aria-invalid', () => {
      const { container } = render(<Input aria-invalid="true" />);
      const input = container.querySelector('input');
      expect(input?.className).toContain('aria-invalid:border-destructive');
      expect(input?.className).toContain('aria-invalid:ring-destructive/20');
    });

    it('should support pattern attribute', () => {
      render(<Input pattern="[0-9]{3}-[0-9]{2}-[0-9]{4}" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('pattern', '[0-9]{3}-[0-9]{2}-[0-9]{4}');
    });

    it('should support min and max for number inputs', () => {
      render(<Input type="number" min={0} max={100} />);
      const input = document.querySelector('input[type="number"]');
      expect(input).toHaveAttribute('min', '0');
      expect(input).toHaveAttribute('max', '100');
    });

    it('should support minLength and maxLength', () => {
      render(<Input minLength={3} maxLength={10} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('minLength', '3');
      expect(input).toHaveAttribute('maxLength', '10');
    });
  });

  describe('Focus State', () => {
    it('should be focusable', async () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      await userEvent.click(input);
      expect(input).toHaveFocus();
    });

    it('should have focus styling classes', () => {
      const { container } = render(<Input />);
      const input = container.querySelector('input');
      expect(input?.className).toContain('focus-visible:border-ring');
      expect(input?.className).toContain('focus-visible:ring-ring/50');
    });

    it('should support autoFocus', () => {
      render(<Input autoFocus />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveFocus();
    });
  });

  describe('HTML Attributes', () => {
    it('should pass through native input attributes', () => {
      render(
        <Input
          name="username"
          id="username-input"
          data-testid="test-input"
          autoComplete="username"
        />
      );
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('name', 'username');
      expect(input).toHaveAttribute('id', 'username-input');
      expect(input).toHaveAttribute('data-testid', 'test-input');
      expect(input).toHaveAttribute('autoComplete', 'username');
    });

    it('should support aria-describedby', () => {
      render(<Input aria-describedby="helper-text" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'helper-text');
    });

    it('should support aria-label', () => {
      render(<Input aria-label="Username" />);
      const input = screen.getByLabelText('Username');
      expect(input).toBeInTheDocument();
    });
  });

  describe('ReadOnly State', () => {
    it('should be read-only when readOnly prop is true', () => {
      render(<Input readOnly value="read only value" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('readOnly');
    });

    it('should not accept input when read-only', async () => {
      render(<Input readOnly defaultValue="initial" />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      await userEvent.type(input, 'new');
      expect(input.value).toBe('initial'); // Value should not change
    });
  });

  describe('File Input', () => {
    it('should render file input with proper styling', () => {
      const { container } = render(<Input type="file" />);
      const input = container.querySelector('input[type="file"]');
      expect(input?.className).toContain('file:border-0');
      expect(input?.className).toContain('file:bg-transparent');
      expect(input?.className).toContain('file:text-sm');
    });
  });

  describe('Styling', () => {
    it('should have transition classes', () => {
      const { container } = render(<Input />);
      const input = container.querySelector('input');
      expect(input?.className).toContain('transition-[color,box-shadow]');
    });

    it('should have outline-none class', () => {
      const { container } = render(<Input />);
      const input = container.querySelector('input');
      expect(input?.className).toContain('outline-none');
    });

    it('should have selection styling', () => {
      const { container } = render(<Input />);
      const input = container.querySelector('input');
      expect(input?.className).toContain('selection:bg-primary');
      expect(input?.className).toContain('selection:text-primary-foreground');
    });

    it('should have border and background classes', () => {
      const { container } = render(<Input />);
      const input = container.querySelector('input');
      expect(input?.className).toContain('border-input');
      expect(input?.className).toContain('bg-input-background');
      expect(input?.className).toContain('dark:bg-input/30');
    });
  });
});
