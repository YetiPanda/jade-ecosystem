/**
 * Custom hook for iCal calendar export
 * Task: T129 - Calendar export functionality
 */

import { useCallback } from 'react';
import { useLazyQuery } from '@apollo/client';
import gql from 'graphql-tag';

// GraphQL queries for iCal export
const EXPORT_APPOINTMENT_ICAL = gql`
  query ExportAppointmentIcal($appointmentId: ID!, $options: ICalExportOptions) {
    exportAppointmentIcal(appointmentId: $appointmentId, options: $options)
  }
`;

const EXPORT_APPOINTMENTS_ICAL = gql`
  query ExportAppointmentsIcal($appointmentIds: [ID!]!, $options: ICalExportOptions) {
    exportAppointmentsIcal(appointmentIds: $appointmentIds, options: $options)
  }
`;

const EXPORT_PROVIDER_CALENDAR = gql`
  query ExportProviderCalendar(
    $providerId: ID!
    $startDate: DateTime!
    $endDate: DateTime!
    $options: ICalExportOptions
  ) {
    exportProviderCalendar(
      providerId: $providerId
      startDate: $startDate
      endDate: $endDate
      options: $options
    )
  }
`;

/**
 * iCal export options
 */
export interface ICalExportOptions {
  includeReminders?: boolean;
  reminderMinutes?: number;
  timezone?: string;
  method?: 'PUBLISH' | 'REQUEST' | 'REPLY' | 'CANCEL';
}

/**
 * Hook for exporting appointments to iCal format
 */
export function useICalExport() {
  const [exportAppointmentQuery] = useLazyQuery(EXPORT_APPOINTMENT_ICAL);
  const [exportAppointmentsQuery] = useLazyQuery(EXPORT_APPOINTMENTS_ICAL);
  const [exportProviderCalendarQuery] = useLazyQuery(EXPORT_PROVIDER_CALENDAR);

  /**
   * Download iCal file
   */
  const downloadICalFile = useCallback((icalContent: string, filename: string) => {
    // Create blob
    const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.ics') ? filename : `${filename}.ics`;

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, []);

  /**
   * Export single appointment
   */
  const exportAppointment = useCallback(
    async (appointmentId: string, appointmentNumber: string, options?: ICalExportOptions) => {
      try {
        const result = await exportAppointmentQuery({
          variables: { appointmentId, options },
        });

        if (result.data?.exportAppointmentIcal) {
          const filename = `appointment-${appointmentNumber}`;
          downloadICalFile(result.data.exportAppointmentIcal, filename);
          return { success: true };
        }

        return { success: false, error: 'Failed to export appointment' };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
    [exportAppointmentQuery, downloadICalFile]
  );

  /**
   * Export multiple appointments
   */
  const exportAppointments = useCallback(
    async (appointmentIds: string[], filename?: string, options?: ICalExportOptions) => {
      try {
        const result = await exportAppointmentsQuery({
          variables: { appointmentIds, options },
        });

        if (result.data?.exportAppointmentsIcal) {
          const exportFilename = filename || `appointments-${new Date().toISOString().split('T')[0]}`;
          downloadICalFile(result.data.exportAppointmentsIcal, exportFilename);
          return { success: true };
        }

        return { success: false, error: 'Failed to export appointments' };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
    [exportAppointmentsQuery, downloadICalFile]
  );

  /**
   * Export provider calendar for date range
   */
  const exportProviderCalendar = useCallback(
    async (
      providerId: string,
      providerName: string,
      startDate: Date,
      endDate: Date,
      options?: ICalExportOptions
    ) => {
      try {
        const result = await exportProviderCalendarQuery({
          variables: {
            providerId,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            options,
          },
        });

        if (result.data?.exportProviderCalendar) {
          const formattedStartDate = startDate.toISOString().split('T')[0];
          const formattedEndDate = endDate.toISOString().split('T')[0];
          const filename = `${providerName.toLowerCase().replace(/\s+/g, '-')}-calendar-${formattedStartDate}-to-${formattedEndDate}`;
          downloadICalFile(result.data.exportProviderCalendar, filename);
          return { success: true };
        }

        return { success: false, error: 'Failed to export calendar' };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },
    [exportProviderCalendarQuery, downloadICalFile]
  );

  return {
    exportAppointment,
    exportAppointments,
    exportProviderCalendar,
  };
}

/**
 * Hook for batch export with UI feedback
 */
export function useICalBatchExport() {
  const { exportAppointments } = useICalExport();

  const exportSelected = useCallback(
    async (selectedAppointments: { id: string; appointmentNumber: string }[]) => {
      if (selectedAppointments.length === 0) {
        return { success: false, error: 'No appointments selected' };
      }

      const appointmentIds = selectedAppointments.map((a) => a.id);
      const filename =
        selectedAppointments.length === 1
          ? `appointment-${selectedAppointments[0].appointmentNumber}`
          : `appointments-export-${new Date().toISOString().split('T')[0]}`;

      return await exportAppointments(appointmentIds, filename, {
        includeReminders: true,
        reminderMinutes: 60,
      });
    },
    [exportAppointments]
  );

  return { exportSelected };
}
