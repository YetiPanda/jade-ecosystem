/**
 * NotificationSettings Component Tests
 * Feature 011: Vendor Portal MVP
 * Phase C: Communication
 * Sprint C.2: Messaging UI - Task C.2.12
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NotificationSettings } from '../NotificationSettings';

// Mock Notification API
global.Notification = {
  permission: 'default',
  requestPermission: vi.fn().mockResolvedValue('granted'),
} as any;

describe('NotificationSettings', () => {
  const defaultProps = {
    onSave: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all notification preference sections', () => {
    render(<NotificationSettings {...defaultProps} />);

    expect(screen.getByText('Notification Settings')).toBeInTheDocument();
    expect(screen.getByText('Email Notifications')).toBeInTheDocument();
    expect(screen.getByText('Desktop Notifications')).toBeInTheDocument();
    expect(screen.getByText('Sound Alerts')).toBeInTheDocument();
    expect(screen.getByText('Quiet Hours')).toBeInTheDocument();
  });

  it('enables email notifications by default', () => {
    render(<NotificationSettings {...defaultProps} />);

    const emailToggle = screen.getByRole('switch', { name: /email notifications/i });
    expect(emailToggle).toBeChecked();
  });

  it('shows email frequency options when email is enabled', () => {
    render(<NotificationSettings {...defaultProps} />);

    expect(screen.getByText('Email Frequency')).toBeInTheDocument();
    // Click to open select dropdown would be tested with user interactions
  });

  it('hides email frequency options when email is disabled', async () => {
    render(<NotificationSettings {...defaultProps} />);

    const emailToggle = screen.getByRole('switch', { name: /email notifications/i });
    fireEvent.click(emailToggle);

    await waitFor(() => {
      expect(screen.queryByText('Email Frequency')).not.toBeInTheDocument();
    });
  });

  it('allows changing email frequency', async () => {
    render(<NotificationSettings {...defaultProps} />);

    const frequencySelect = screen.getByRole('combobox', { name: /email frequency/i });
    fireEvent.click(frequencySelect);

    await waitFor(() => {
      expect(screen.getByText(/hourly digest/i)).toBeInTheDocument();
      expect(screen.getByText(/daily digest/i)).toBeInTheDocument();
      expect(screen.getByText(/weekly digest/i)).toBeInTheDocument();
    });
  });

  it('requests desktop notification permission when enabled', async () => {
    render(<NotificationSettings {...defaultProps} />);

    const desktopToggle = screen.getByRole('switch', { name: /desktop notifications/i });
    fireEvent.click(desktopToggle);

    await waitFor(() => {
      expect(Notification.requestPermission).toHaveBeenCalled();
    });
  });

  it('toggles sound alerts', async () => {
    render(<NotificationSettings {...defaultProps} />);

    const soundToggle = screen.getByRole('switch', { name: /sound alerts/i });
    expect(soundToggle).toBeChecked(); // Default is enabled

    fireEvent.click(soundToggle);

    await waitFor(() => {
      expect(soundToggle).not.toBeChecked();
    });
  });

  it('shows mute options', () => {
    render(<NotificationSettings {...defaultProps} />);

    expect(screen.getByText('Mute for 1 hour')).toBeInTheDocument();
    expect(screen.getByText('Mute for 4 hours')).toBeInTheDocument();
    expect(screen.getByText('Mute for 24 hours')).toBeInTheDocument();
  });

  it('mutes notifications for specified duration', async () => {
    render(<NotificationSettings {...defaultProps} />);

    const muteButton = screen.getByText('Mute for 1 hour');
    fireEvent.click(muteButton);

    await waitFor(() => {
      expect(screen.getByText(/notifications muted until/i)).toBeInTheDocument();
      expect(screen.getByText('Unmute Now')).toBeInTheDocument();
    });
  });

  it('allows unmuting notifications', async () => {
    render(<NotificationSettings {...defaultProps} />);

    // First mute
    const muteButton = screen.getByText('Mute for 1 hour');
    fireEvent.click(muteButton);

    await waitFor(() => {
      expect(screen.getByText('Unmute Now')).toBeInTheDocument();
    });

    // Then unmute
    const unmuteButton = screen.getByText('Unmute Now');
    fireEvent.click(unmuteButton);

    await waitFor(() => {
      expect(screen.queryByText('Unmute Now')).not.toBeInTheDocument();
      expect(screen.getByText('Mute for 1 hour')).toBeInTheDocument();
    });
  });

  it('shows save button when settings change', async () => {
    render(<NotificationSettings {...defaultProps} />);

    // Initially no save button
    expect(screen.queryByText('Save Notification Settings')).not.toBeInTheDocument();

    // Change a setting
    const soundToggle = screen.getByRole('switch', { name: /sound alerts/i });
    fireEvent.click(soundToggle);

    await waitFor(() => {
      expect(screen.getByText('Save Notification Settings')).toBeInTheDocument();
    });
  });

  it('calls onSave when save button clicked', async () => {
    const onSave = vi.fn();
    render(<NotificationSettings onSave={onSave} />);

    // Change a setting
    const soundToggle = screen.getByRole('switch', { name: /sound alerts/i });
    fireEvent.click(soundToggle);

    await waitFor(() => {
      expect(screen.getByText('Save Notification Settings')).toBeInTheDocument();
    });

    // Click save
    const saveButton = screen.getByText('Save Notification Settings');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        emailEnabled: true,
        emailFrequency: 'immediate',
        desktopEnabled: false,
        soundEnabled: false, // Changed from true to false
        muteUntil: null,
      });
    });
  });

  it('displays usage tips', () => {
    render(<NotificationSettings {...defaultProps} />);

    expect(screen.getByText(/email digests.*perfect for staying updated/i)).toBeInTheDocument();
    expect(screen.getByText(/desktop notifications.*never miss important messages/i)).toBeInTheDocument();
    expect(screen.getByText(/mute notifications.*work-life balance/i)).toBeInTheDocument();
  });

  it('shows description for each email frequency option', async () => {
    render(<NotificationSettings {...defaultProps} />);

    const frequencySelect = screen.getByRole('combobox', { name: /email frequency/i });

    // Default is immediate
    expect(screen.getByText(/you'll receive an email immediately/i)).toBeInTheDocument();

    // Change to hourly
    fireEvent.click(frequencySelect);
    await waitFor(() => screen.getByText(/hourly digest/i));
    fireEvent.click(screen.getByText(/hourly digest/i));

    await waitFor(() => {
      expect(screen.getByText(/you'll receive a summary.*every hour/i)).toBeInTheDocument();
    });
  });

  it('handles notification permission denial gracefully', async () => {
    // Mock permission denial
    (Notification.requestPermission as any).mockResolvedValueOnce('denied');

    render(<NotificationSettings {...defaultProps} />);

    const desktopToggle = screen.getByRole('switch', { name: /desktop notifications/i });
    fireEvent.click(desktopToggle);

    await waitFor(() => {
      expect(Notification.requestPermission).toHaveBeenCalled();
      // Desktop notifications should remain disabled
      expect(desktopToggle).not.toBeChecked();
    });
  });

  it('calculates mute expiry correctly', async () => {
    const now = new Date('2025-01-15T10:00:00Z');
    vi.setSystemTime(now);

    render(<NotificationSettings {...defaultProps} />);

    const muteButton = screen.getByText('Mute for 4 hours');
    fireEvent.click(muteButton);

    await waitFor(() => {
      // Should show time 4 hours from now
      expect(screen.getByText(/notifications muted until.*2:00.*PM/i)).toBeInTheDocument();
    });

    vi.useRealTimers();
  });
});
