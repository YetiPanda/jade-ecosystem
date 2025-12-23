/**
 * Settings Page
 *
 * User settings management with tabs for:
 * - Profile: Display name, timezone, language, phone
 * - Notifications: Email, push, SMS preferences
 * - Preferences: Theme, display options, accessibility
 */

import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Button } from '../components/ui/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { useSettings } from '../hooks/useSettings';

// Timezone options
const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' },
  { value: 'UTC', label: 'UTC' },
];

// Language options
const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
  { value: 'zh', label: '中文' },
];

// Date format options
const DATE_FORMATS = [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
];

// Time format options
const TIME_FORMATS = [
  { value: '12h', label: '12-hour (1:00 PM)' },
  { value: '24h', label: '24-hour (13:00)' },
];

// Currency options
const CURRENCIES = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'CAD', label: 'CAD (C$)' },
  { value: 'AUD', label: 'AUD (A$)' },
  { value: 'JPY', label: 'JPY (¥)' },
];

// Items per page options
const ITEMS_PER_PAGE_OPTIONS = [10, 20, 25, 50, 100];

const SettingsPage: React.FC = () => {
  const {
    settings,
    loading,
    isUpdating,
    errors,
    updateProfileSettings,
    updateNotificationSettings,
    updateAppPreferences,
    resetToDefaults,
  } = useSettings();

  // Profile form state
  const [displayName, setDisplayName] = useState('');
  const [timezone, setTimezone] = useState('America/New_York');
  const [language, setLanguage] = useState('en');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [timeFormat, setTimeFormat] = useState('12h');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Notification form state
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [reminderHours, setReminderHours] = useState(24);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [productAnnouncements, setProductAnnouncements] = useState(true);
  const [communityActivity, setCommunityActivity] = useState(true);

  // Preferences form state
  const [theme, setTheme] = useState<'LIGHT' | 'DARK' | 'SYSTEM'>('SYSTEM');
  const [defaultView, setDefaultView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showPricesWithTax, setShowPricesWithTax] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [keyboardShortcuts, setKeyboardShortcuts] = useState(true);
  const [compactMode, setCompactMode] = useState(false);

  // Sync form state with loaded settings
  useEffect(() => {
    if (settings) {
      // Profile
      setDisplayName(settings.profile.displayName || '');
      setTimezone(settings.profile.timezone);
      setLanguage(settings.profile.language);
      setDateFormat(settings.profile.dateFormat);
      setTimeFormat(settings.profile.timeFormat);
      setPhoneNumber(settings.profile.phoneNumber || '');

      // Notifications
      setEmailEnabled(settings.notifications.emailEnabled);
      setPushEnabled(settings.notifications.pushEnabled);
      setSmsEnabled(settings.notifications.smsEnabled);
      setAppointmentReminders(settings.notifications.appointmentReminders);
      setReminderHours(settings.notifications.reminderHours);
      setOrderUpdates(settings.notifications.orderUpdates);
      setMarketingEmails(settings.notifications.marketingEmails);
      setWeeklyDigest(settings.notifications.weeklyDigest);
      setProductAnnouncements(settings.notifications.productAnnouncements);
      setCommunityActivity(settings.notifications.communityActivity);

      // Preferences
      setTheme(settings.preferences.theme);
      setDefaultView(settings.preferences.defaultView);
      setSidebarCollapsed(settings.preferences.sidebarCollapsed);
      setShowPricesWithTax(settings.preferences.showPricesWithTax);
      setCurrency(settings.preferences.currency);
      setItemsPerPage(settings.preferences.itemsPerPage);
      setKeyboardShortcuts(settings.preferences.keyboardShortcuts);
      setCompactMode(settings.preferences.compactMode);
    }
  }, [settings]);

  // Save handlers
  const handleSaveProfile = async () => {
    await updateProfileSettings({
      displayName: displayName || null,
      timezone,
      language,
      dateFormat,
      timeFormat,
      phoneNumber: phoneNumber || null,
    });
  };

  const handleSaveNotifications = async () => {
    await updateNotificationSettings({
      emailEnabled,
      pushEnabled,
      smsEnabled,
      appointmentReminders,
      reminderHours,
      orderUpdates,
      marketingEmails,
      weeklyDigest,
      productAnnouncements,
      communityActivity,
    });
  };

  const handleSavePreferences = async () => {
    await updateAppPreferences({
      theme,
      defaultView,
      sidebarCollapsed,
      showPricesWithTax,
      currency,
      itemsPerPage,
      keyboardShortcuts,
      compactMode,
    });
  };

  const handleResetAll = async () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      await resetToDefaults();
    }
  };

  if (loading && !settings) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      {errors.length > 0 && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          {errors.map((error, i) => (
            <p key={i} className="text-destructive text-sm">
              {error.message}
            </p>
          ))}
        </div>
      )}

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your display name, regional settings, and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Display Name */}
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your display name"
                />
                <p className="text-sm text-muted-foreground">
                  This is how your name will appear across the platform
                </p>
              </div>

              {/* Timezone */}
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Language */}
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date & Time Format */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select value={dateFormat} onValueChange={setDateFormat}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      {DATE_FORMATS.map((fmt) => (
                        <SelectItem key={fmt.value} value={fmt.value}>
                          {fmt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeFormat">Time Format</Label>
                  <Select value={timeFormat} onValueChange={setTimeFormat}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_FORMATS.map((fmt) => (
                        <SelectItem key={fmt.value} value={fmt.value}>
                          {fmt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
                <p className="text-sm text-muted-foreground">
                  Used for SMS notifications and account recovery
                </p>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveProfile} disabled={isUpdating}>
                  {isUpdating ? 'Saving...' : 'Save Profile'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Notification Channels */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Notification Channels</h3>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailEnabled">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    id="emailEnabled"
                    checked={emailEnabled}
                    onCheckedChange={setEmailEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushEnabled">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive browser push notifications
                    </p>
                  </div>
                  <Switch
                    id="pushEnabled"
                    checked={pushEnabled}
                    onCheckedChange={setPushEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsEnabled">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive text message notifications
                    </p>
                  </div>
                  <Switch
                    id="smsEnabled"
                    checked={smsEnabled}
                    onCheckedChange={setSmsEnabled}
                  />
                </div>
              </div>

              <hr className="border-border" />

              {/* Appointment Reminders */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Appointments</h3>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="appointmentReminders">Appointment Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Get reminded about upcoming appointments
                    </p>
                  </div>
                  <Switch
                    id="appointmentReminders"
                    checked={appointmentReminders}
                    onCheckedChange={setAppointmentReminders}
                  />
                </div>

                {appointmentReminders && (
                  <div className="space-y-2 pl-4 border-l-2 border-muted">
                    <Label htmlFor="reminderHours">Reminder Time</Label>
                    <Select
                      value={reminderHours.toString()}
                      onValueChange={(v) => setReminderHours(parseInt(v))}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hour before</SelectItem>
                        <SelectItem value="2">2 hours before</SelectItem>
                        <SelectItem value="4">4 hours before</SelectItem>
                        <SelectItem value="12">12 hours before</SelectItem>
                        <SelectItem value="24">24 hours before</SelectItem>
                        <SelectItem value="48">48 hours before</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <hr className="border-border" />

              {/* Updates & Marketing */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Updates & Marketing</h3>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="orderUpdates">Order Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications about your orders and shipments
                    </p>
                  </div>
                  <Switch
                    id="orderUpdates"
                    checked={orderUpdates}
                    onCheckedChange={setOrderUpdates}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketingEmails">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Promotional offers and special deals
                    </p>
                  </div>
                  <Switch
                    id="marketingEmails"
                    checked={marketingEmails}
                    onCheckedChange={setMarketingEmails}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weeklyDigest">Weekly Digest</Label>
                    <p className="text-sm text-muted-foreground">
                      Weekly summary of your activity and insights
                    </p>
                  </div>
                  <Switch
                    id="weeklyDigest"
                    checked={weeklyDigest}
                    onCheckedChange={setWeeklyDigest}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="productAnnouncements">Product Announcements</Label>
                    <p className="text-sm text-muted-foreground">
                      New features and product updates
                    </p>
                  </div>
                  <Switch
                    id="productAnnouncements"
                    checked={productAnnouncements}
                    onCheckedChange={setProductAnnouncements}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="communityActivity">Community Activity</Label>
                    <p className="text-sm text-muted-foreground">
                      Updates from Sanctuary community
                    </p>
                  </div>
                  <Switch
                    id="communityActivity"
                    checked={communityActivity}
                    onCheckedChange={setCommunityActivity}
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveNotifications} disabled={isUpdating}>
                  {isUpdating ? 'Saving...' : 'Save Notifications'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>App Preferences</CardTitle>
              <CardDescription>
                Customize your experience with display and accessibility options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Appearance */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Appearance</h3>

                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={theme} onValueChange={(v) => setTheme(v as 'LIGHT' | 'DARK' | 'SYSTEM')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LIGHT">Light</SelectItem>
                      <SelectItem value="DARK">Dark</SelectItem>
                      <SelectItem value="SYSTEM">System Default</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="compactMode">Compact Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Use a more condensed layout
                    </p>
                  </div>
                  <Switch
                    id="compactMode"
                    checked={compactMode}
                    onCheckedChange={setCompactMode}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sidebarCollapsed">Collapse Sidebar by Default</Label>
                    <p className="text-sm text-muted-foreground">
                      Start with the sidebar minimized
                    </p>
                  </div>
                  <Switch
                    id="sidebarCollapsed"
                    checked={sidebarCollapsed}
                    onCheckedChange={setSidebarCollapsed}
                  />
                </div>
              </div>

              <hr className="border-border" />

              {/* Display Options */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Display Options</h3>

                <div className="space-y-2">
                  <Label htmlFor="defaultView">Default View</Label>
                  <Select value={defaultView} onValueChange={setDefaultView}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select view" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dashboard">Dashboard</SelectItem>
                      <SelectItem value="marketplace">Marketplace</SelectItem>
                      <SelectItem value="appointments">Appointments</SelectItem>
                      <SelectItem value="clients">Clients</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Page shown when you first log in
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="itemsPerPage">Items Per Page</Label>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(v) => setItemsPerPage(parseInt(v))}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {ITEMS_PER_PAGE_OPTIONS.map((n) => (
                        <SelectItem key={n} value={n.toString()}>
                          {n}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="showPricesWithTax">Show Prices with Tax</Label>
                    <p className="text-sm text-muted-foreground">
                      Display prices including applicable taxes
                    </p>
                  </div>
                  <Switch
                    id="showPricesWithTax"
                    checked={showPricesWithTax}
                    onCheckedChange={setShowPricesWithTax}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <hr className="border-border" />

              {/* Accessibility */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Accessibility</h3>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="keyboardShortcuts">Keyboard Shortcuts</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable keyboard navigation shortcuts
                    </p>
                  </div>
                  <Switch
                    id="keyboardShortcuts"
                    checked={keyboardShortcuts}
                    onCheckedChange={setKeyboardShortcuts}
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4">
                <Button onClick={handleSavePreferences} disabled={isUpdating}>
                  {isUpdating ? 'Saving...' : 'Save Preferences'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Reset All Settings */}
      <Card className="mt-8 border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Actions here cannot be undone
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Reset All Settings</p>
              <p className="text-sm text-muted-foreground">
                Restore all settings to their default values
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={handleResetAll}
              disabled={isUpdating}
            >
              Reset All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
