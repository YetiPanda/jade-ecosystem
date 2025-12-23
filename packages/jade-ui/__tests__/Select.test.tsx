import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '../src/components/Select';

describe('Select', () => {
  it('renders select trigger with placeholder', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    expect(screen.getByText('Select option')).toBeInTheDocument();
  });

  it('displays selected value in trigger', async () => {
    render(
      <Select defaultValue="option2">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    );

    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('supports disabled state', () => {
    render(
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Disabled" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByText('Disabled').closest('button');
    expect(trigger).toBeDisabled();
  });
});

describe('SelectTrigger', () => {
  it('renders with data-slot attribute', () => {
    render(
      <Select>
        <SelectTrigger data-testid="trigger">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="test">Test</SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByTestId('trigger');
    expect(trigger).toHaveAttribute('data-slot', 'select-trigger');
  });

  it('applies default size styles', () => {
    render(
      <Select>
        <SelectTrigger data-testid="trigger">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="test">Test</SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByTestId('trigger');
    expect(trigger).toHaveAttribute('data-size', 'default');
  });

  it('applies small size when specified', () => {
    render(
      <Select>
        <SelectTrigger size="sm" data-testid="trigger">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="test">Test</SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByTestId('trigger');
    expect(trigger).toHaveAttribute('data-size', 'sm');
  });

  it('merges custom className', () => {
    render(
      <Select>
        <SelectTrigger className="custom-trigger" data-testid="trigger">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="test">Test</SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByTestId('trigger');
    expect(trigger).toHaveClass('custom-trigger');
  });

  it('renders chevron down icon', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="With Icon" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="test">Test</SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByText('With Icon').closest('button');
    const svg = trigger?.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});

describe('SelectGroup', () => {
  it('renders with data-slot attribute', () => {
    render(
      <Select defaultOpen>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup data-testid="group">
            <SelectItem value="test">Test</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );

    const group = document.querySelector('[data-slot="select-group"]');
    expect(group).toBeInTheDocument();
  });

  it('groups items correctly with label', () => {
    render(
      <Select defaultOpen>
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Group 1</SelectLabel>
            <SelectItem value="item1">Item 1</SelectItem>
            <SelectItem value="item2">Item 2</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );

    // Label should be within group
    const label = document.querySelector('[data-slot="select-label"]');
    expect(label).toBeInTheDocument();
  });
});

describe('SelectValue', () => {
  it('renders with data-slot attribute', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue data-testid="value" placeholder="Test" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="test">Test</SelectItem>
        </SelectContent>
      </Select>
    );

    const value = document.querySelector('[data-slot="select-value"]');
    expect(value).toBeInTheDocument();
  });
});

describe('Select composition', () => {
  it('renders complete select with all parts', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choose an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectScrollUpButton />
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Vegetables</SelectLabel>
            <SelectItem value="carrot">Carrot</SelectItem>
            <SelectItem value="potato">Potato</SelectItem>
          </SelectGroup>
          <SelectScrollDownButton />
        </SelectContent>
      </Select>
    );

    expect(screen.getByText('Choose an option')).toBeInTheDocument();
  });

  it('renders with controlled value', () => {
    const onValueChange = vi.fn();

    render(
      <Select value="apple" onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectContent>
      </Select>
    );

    expect(screen.getByText('Apple')).toBeInTheDocument();
  });
});
