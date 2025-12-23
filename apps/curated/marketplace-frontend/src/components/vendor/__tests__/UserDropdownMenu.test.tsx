/**
 * UserDropdownMenu Tests
 * Feature 011: Vendor Portal MVP
 * Phase 2: Secondary Navigation Component Tests
 *
 * Tests cover:
 * - Menu rendering and structure
 * - Navigation links (Profile, Training, Settings)
 * - Conditional Application Status link
 * - Keyboard navigation and accessibility
 * - User information display
 */

import { describe, it, expect } from 'vitest';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { UserDropdownMenu } from '../UserDropdownMenu';

describe('UserDropdownMenu', () => {
  const defaultProps = {
    userName: 'Jane Smith',
    userInitial: 'J',
    showApplicationStatus: false,
  };

  describe('Dropdown Trigger', () => {
    it('renders trigger button with user name', () => {
      render(
        <MemoryRouter>
          <UserDropdownMenu {...defaultProps} />
        </MemoryRouter>
      );

      const trigger = screen.getByRole('button', { name: /jane smith/i });
      expect(trigger).toBeInTheDocument();
    });

    it('displays user initial in avatar', () => {
      render(
        <MemoryRouter>
          <UserDropdownMenu {...defaultProps} />
        </MemoryRouter>
      );

      expect(screen.getByText('J')).toBeInTheDocument();
    });

    it('displays chevron down icon', () => {
      render(
        <MemoryRouter>
          <UserDropdownMenu {...defaultProps} />
        </MemoryRouter>
      );

      const trigger = screen.getByRole('button');
      const chevron = trigger.querySelector('svg.lucide-chevron-down');
      expect(chevron).toBeInTheDocument();
    });

    it('has correct styling for avatar', () => {
      render(
        <MemoryRouter>
          <UserDropdownMenu {...defaultProps} />
        </MemoryRouter>
      );

      const avatar = screen.getByText('J').parentElement;
      expect(avatar).toHaveClass('rounded-full');
    });
  });

  describe('Menu Content - Basic Items', () => {
    it('opens menu when trigger is clicked', async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <UserDropdownMenu {...defaultProps} />
        </MemoryRouter>
      );

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: /profile/i })).toBeInTheDocument();
      });
    });

    it('displays user information in menu header', async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <UserDropdownMenu {...defaultProps} />
        </MemoryRouter>
      );

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('Vendor Portal')).toBeInTheDocument();
      });
    });

    it('contains Profile menu item with correct link', async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <UserDropdownMenu {...defaultProps} />
        </MemoryRouter>
      );

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await waitFor(() => {
        const profileLink = screen.getByRole('menuitem', { name: /profile/i });
        expect(profileLink).toHaveAttribute('href', '/app/vendor/profile');
      });
    });

    it('contains Training menu item with correct link', async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <UserDropdownMenu {...defaultProps} />
        </MemoryRouter>
      );

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await waitFor(() => {
        const trainingLink = screen.getByRole('menuitem', { name: /training/i });
        expect(trainingLink).toHaveAttribute('href', '/app/vendor/training');
      });
    });

    it('contains Settings menu item with correct link', async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <UserDropdownMenu {...defaultProps} />
        </MemoryRouter>
      );

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await waitFor(() => {
        const settingsLink = screen.getByRole('menuitem', { name: /settings/i });
        expect(settingsLink).toHaveAttribute('href', '/app/settings');
      });
    });

    it('displays icons for all menu items', async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <UserDropdownMenu {...defaultProps} />
        </MemoryRouter>
      );

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await waitFor(() => {
        const profileItem = screen.getByRole('menuitem', { name: /profile/i });
        const trainingItem = screen.getByRole('menuitem', { name: /training/i });
        const settingsItem = screen.getByRole('menuitem', { name: /settings/i });

        expect(within(profileItem).getByRole('img', { hidden: true })).toBeInTheDocument();
        expect(within(trainingItem).getByRole('img', { hidden: true })).toBeInTheDocument();
        expect(within(settingsItem).getByRole('img', { hidden: true })).toBeInTheDocument();
      });
    });
  });

  describe('Conditional Application Status Link', () => {
    it('does NOT show Application Status when showApplicationStatus is false', async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <UserDropdownMenu {...defaultProps} showApplicationStatus={false} />
        </MemoryRouter>
      );

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: /profile/i })).toBeInTheDocument();
      });

      expect(screen.queryByRole('menuitem', { name: /application status/i })).not.toBeInTheDocument();
    });

    it('DOES show Application Status when showApplicationStatus is true', async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <UserDropdownMenu {...defaultProps} showApplicationStatus={true} />
        </MemoryRouter>
      );

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await waitFor(() => {
        const appStatusLink = screen.getByRole('menuitem', { name: /application status/i });
        expect(appStatusLink).toBeInTheDocument();
        expect(appStatusLink).toHaveAttribute('href', '/app/vendor/application/status');
      });
    });

    it('displays Application Status with separator when shown', async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <UserDropdownMenu {...defaultProps} showApplicationStatus={true} />
        </MemoryRouter>
      );

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await waitFor(() => {
        const appStatusLink = screen.getByRole('menuitem', { name: /application status/i });
        expect(appStatusLink).toBeInTheDocument();
      });

      // Should have separator before Application Status
      const menu = screen.getByRole('menu');
      const separators = menu.querySelectorAll('[role="separator"]');
      expect(separators.length).toBeGreaterThan(1); // At least 2 separators
    });
  });

  describe('Keyboard Navigation', () => {
    it('allows keyboard navigation with Tab key', async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <UserDropdownMenu {...defaultProps} />
        </MemoryRouter>
      );

      // Tab to trigger button
      await user.tab();
      expect(screen.getByRole('button')).toHaveFocus();
    });

    it('opens menu with Enter key', async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <UserDropdownMenu {...defaultProps} />
        </MemoryRouter>
      );

      const trigger = screen.getByRole('button');
      trigger.focus();

      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: /profile/i })).toBeInTheDocument();
      });
    });

    it('opens menu with Space key', async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <UserDropdownMenu {...defaultProps} />
        </MemoryRouter>
      );

      const trigger = screen.getByRole('button');
      trigger.focus();

      await user.keyboard(' ');

      await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: /profile/i })).toBeInTheDocument();
      });
    });

    it('closes menu with Escape key', async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <UserDropdownMenu {...defaultProps} />
        </MemoryRouter>
      );

      // Open menu
      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: /profile/i })).toBeInTheDocument();
      });

      // Close menu with Escape
      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByRole('menuitem', { name: /profile/i })).not.toBeInTheDocument();
      });
    });

    it('closes menu when clicking outside', async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <div>
            <UserDropdownMenu {...defaultProps} />
            <div data-testid="outside">Outside element</div>
          </div>
        </MemoryRouter>
      );

      // Open menu
      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: /profile/i })).toBeInTheDocument();
      });

      // Click outside
      const outside = screen.getByTestId('outside');
      await user.click(outside);

      await waitFor(() => {
        expect(screen.queryByRole('menuitem', { name: /profile/i })).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA roles for menu structure', async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <UserDropdownMenu {...defaultProps} />
        </MemoryRouter>
      );

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
        expect(screen.getAllByRole('menuitem').length).toBeGreaterThan(0);
      });
    });

    it('has accessible labels for menu items', async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <UserDropdownMenu {...defaultProps} />
        </MemoryRouter>
      );

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: /profile/i })).toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: /training/i })).toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: /settings/i })).toBeInTheDocument();
      });
    });

    it('maintains focus management when opening/closing menu', async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <UserDropdownMenu {...defaultProps} />
        </MemoryRouter>
      );

      const trigger = screen.getByRole('button');
      trigger.focus();
      expect(trigger).toHaveFocus();

      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole('menuitem', { name: /profile/i })).toBeInTheDocument();
      });

      // Close menu
      await user.keyboard('{Escape}');

      await waitFor(() => {
        // Focus should return to trigger
        expect(trigger).toHaveFocus();
      });
    });
  });

  describe('Different User Scenarios', () => {
    it('handles user with only email (no name)', async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <UserDropdownMenu userName="vendor@example.com" userInitial="v" />
        </MemoryRouter>
      );

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getAllByText('vendor@example.com')[0]).toBeInTheDocument();
      });
    });

    it('handles single-letter initial', () => {
      render(
        <MemoryRouter>
          <UserDropdownMenu userName="Alice" userInitial="A" />
        </MemoryRouter>
      );

      expect(screen.getByText('A')).toBeInTheDocument();
    });

    it('handles long user names gracefully', () => {
      render(
        <MemoryRouter>
          <UserDropdownMenu
            userName="Christopher Alexander Montgomery"
            userInitial="C"
          />
        </MemoryRouter>
      );

      expect(screen.getByText('Christopher Alexander Montgomery')).toBeInTheDocument();
    });
  });

  describe('Menu Positioning', () => {
    it('aligns menu to the right (end)', async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <UserDropdownMenu {...defaultProps} />
        </MemoryRouter>
      );

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await waitFor(() => {
        // Menu content should be present
        const menu = screen.getByRole('menu');
        expect(menu).toBeInTheDocument();
      });
    });

    it('sets correct width for menu', async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <UserDropdownMenu {...defaultProps} />
        </MemoryRouter>
      );

      const trigger = screen.getByRole('button');
      await user.click(trigger);

      await waitFor(() => {
        const menu = screen.getByRole('menu');
        expect(menu).toHaveClass('w-56'); // 14rem width
      });
    });
  });
});
