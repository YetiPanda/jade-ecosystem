/**
 * Notification Settings Component
 * Feature 011: Vendor Portal MVP
 * Phase C: Communication
 * Sprint C.2: Messaging UI - Task C.2.10
 *
 * Allows vendors to configure messaging notification preferences
 */

import React, { useState } from 'react';
import { Bell, Mail, Volume2, Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface NotificationPreferences {
  emailEnabled: boolean;
  emailFrequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  desktopEnabled: boolean;
  soundEnabled: boolean;
  muteUntil?: Date | null;
}

interface NotificationSettingsProps {
  onSave?: (preferences: NotificationPreferences) => void;
}

/**
 * NotificationSettings
 *
 * Provides UI for configuring:
 * - Email notifications (immediate, digest)
 * - Desktop notifications
 * - Sound alerts
 * - Quiet hours
 */
export function NotificationSettings({ onSave }: NotificationSettingsProps) {
  // Default preferences (in production, load from backend)
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailEnabled: true,
    emailFrequency: 'immediate',
    desktopEnabled: false,
    soundEnabled: true,
    muteUntil: null,
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handlePreferenceChange = (
    key: keyof NotificationPreferences,
    value: any
  ) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    console.log('[NotificationSettings] Saving preferences:', preferences);
    onSave?.(preferences);
    setHasChanges(false);

    // TODO: Save to backend via GraphQL mutation
  };

  const handleRequestDesktopPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notifications');
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      handlePreferenceChange('desktopEnabled', true);
      new Notification('Notifications enabled', {
        body: "You'll receive desktop notifications for new messages.",
      });
    }
  };

  const handleMuteFor = (hours: number) => {
    const muteUntil = new Date();
    muteUntil.setHours(muteUntil.getHours() + hours);
    handlePreferenceChange('muteUntil', muteUntil);
  };

  const handleUnmute = () => {
    handlePreferenceChange('muteUntil', null);
  };

  const isMuted = preferences.muteUntil && preferences.muteUntil > new Date();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
          <CardDescription>
            Configure how you want to be notified about new messages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Notifications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="email-enabled" className="text-base font-medium">
                  Email Notifications
                </Label>
              </div>
              <Switch
                id="email-enabled"
                checked={preferences.emailEnabled}
                onCheckedChange={(checked) =>
                  handlePreferenceChange('emailEnabled', checked)
                }
              />
            </div>

            {preferences.emailEnabled && (
              <div className="ml-6 space-y-2">
                <Label htmlFor="email-frequency" className="text-sm">
                  Email Frequency
                </Label>
                <Select
                  value={preferences.emailFrequency}
                  onValueChange={(value) =>
                    handlePreferenceChange('emailFrequency', value as any)
                  }
                >
                  <SelectTrigger id="email-frequency" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">
                      Immediate - Send email for each message
                    </SelectItem>
                    <SelectItem value="hourly">
                      Hourly Digest - Summary every hour
                    </SelectItem>
                    <SelectItem value="daily">
                      Daily Digest - Summary once per day (9 AM)
                    </SelectItem>
                    <SelectItem value="weekly">
                      Weekly Digest - Summary every Monday
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {preferences.emailFrequency === 'immediate'
                    ? "You'll receive an email immediately when a new message arrives."
                    : preferences.emailFrequency === 'hourly'
                    ? "You'll receive a summary of new messages every hour."
                    : preferences.emailFrequency === 'daily'
                    ? "You'll receive a daily summary at 9:00 AM."
                    : "You'll receive a weekly summary every Monday morning."}
                </p>
              </div>
            )}
          </div>

          {/* Desktop Notifications */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="desktop-enabled" className="text-base font-medium">
                  Desktop Notifications
                </Label>
              </div>
              <Switch
                id="desktop-enabled"
                checked={preferences.desktopEnabled}
                onCheckedChange={(checked) => {
                  if (checked) {
                    handleRequestDesktopPermission();
                  } else {
                    handlePreferenceChange('desktopEnabled', false);
                  }
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground ml-6">
              Show browser notifications when you receive new messages (even when tab is not active)
            </p>
          </div>

          {/* Sound Notifications */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="sound-enabled" className="text-base font-medium">
                  Sound Alerts
                </Label>
              </div>
              <Switch
                id="sound-enabled"
                checked={preferences.soundEnabled}
                onCheckedChange={(checked) =>
                  handlePreferenceChange('soundEnabled', checked)
                }
              />
            </div>
            <p className="text-xs text-muted-foreground ml-6">
              Play a sound when you receive new messages
            </p>
          </div>

          {/* Quiet Hours / Mute */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Label className="text-base font-medium">Quiet Hours</Label>
            </div>

            {isMuted ? (
              <div className="ml-6">
                <p className="text-sm text-amber-600 mb-2">
                  Notifications muted until{' '}
                  {preferences.muteUntil?.toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </p>
                <Button variant="outline" size="sm" onClick={handleUnmute}>
                  Unmute Now
                </Button>
              </div>
            ) : (
              <div className="ml-6 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMuteFor(1)}
                >
                  Mute for 1 hour
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMuteFor(4)}
                >
                  Mute for 4 hours
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMuteFor(24)}
                >
                  Mute for 24 hours
                </Button>
              </div>
            )}
          </div>

          {/* Save Button */}
          {hasChanges && (
            <div className="pt-4 border-t">
              <Button onClick={handleSave} className="w-full">
                Save Notification Settings
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            • <strong>Email digests</strong> are perfect for staying updated without constant
            interruptions.
          </p>
          <p>
            • <strong>Desktop notifications</strong> ensure you never miss important messages
            from spa partners.
          </p>
          <p>
            • <strong>Mute notifications</strong> during focus time or after-hours to maintain
            work-life balance.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
