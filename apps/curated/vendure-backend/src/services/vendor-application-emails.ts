/**
 * Vendor Application Email Templates
 * Feature 011: Vendor Portal MVP
 * Sprint E.1: Application & Onboarding
 * Tasks E.1.11 & E.1.12
 *
 * Email templates for:
 * - Application approval (E.1.11)
 * - Onboarding reminders (E.1.12)
 * - Application rejection
 * - Additional information requests
 */

/**
 * Application Approval Email (Task E.1.11)
 *
 * Sent when vendor application is approved.
 * Includes next steps for onboarding.
 */
export function generateApplicationApprovalEmail(data: {
  vendorName: string;
  brandName: string;
  onboardingUrl: string;
  successManagerName: string;
  successManagerEmail: string;
}): { subject: string; body: string } {
  const subject = `🎉 Your ${data.brandName} Application is Approved!`;

  const body = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
        }
        .header {
          background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
          color: white;
          padding: 40px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .content {
          padding: 40px 30px;
        }
        .welcome-banner {
          background: linear-gradient(135deg, #10B981 0%, #059669 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        .welcome-banner h2 {
          margin: 0 0 10px 0;
          font-size: 24px;
        }
        .section {
          margin: 30px 0;
        }
        .section-title {
          color: #4F46E5;
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 15px;
        }
        .checklist {
          background: #F9FAFB;
          border-left: 4px solid #4F46E5;
          padding: 20px;
          margin: 15px 0;
        }
        .checklist-item {
          display: flex;
          align-items: start;
          margin: 12px 0;
        }
        .checklist-item::before {
          content: "✓";
          color: #10B981;
          font-weight: bold;
          font-size: 20px;
          margin-right: 12px;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
          color: white;
          padding: 16px 32px;
          text-decoration: none;
          border-radius: 8px;
          margin: 20px 0;
          font-weight: bold;
          text-align: center;
        }
        .button:hover {
          background: linear-gradient(135deg, #4338CA 0%, #6D28D9 100%);
        }
        .info-box {
          background: #EFF6FF;
          border: 1px solid #BFDBFE;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .info-box strong {
          color: #1E40AF;
        }
        .timeline {
          background: #F9FAFB;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          color: #6B7280;
          font-size: 14px;
          padding: 30px 20px;
          background: #F9FAFB;
        }
        .footer a {
          color: #4F46E5;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>JADE Marketplace</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Curated Wellness Products for Spas</p>
        </div>

        <div class="content">
          <div class="welcome-banner">
            <h2>🎉 Congratulations, ${data.vendorName}!</h2>
            <p style="margin: 0; font-size: 18px;">Your ${data.brandName} application has been approved!</p>
          </div>

          <p style="font-size: 16px;">
            We're excited to welcome ${data.brandName} to the JADE Marketplace family! Our curation team has reviewed your application and we believe your products are a perfect fit for our spa partners.
          </p>

          <div class="section">
            <h3 class="section-title">What Happens Next?</h3>
            <p>
              Complete your onboarding checklist to launch your storefront. Most vendors complete onboarding within <strong>2 weeks</strong>.
            </p>

            <div class="checklist">
              <div class="checklist-item">Complete your brand profile (logo, story, values)</div>
              <div class="checklist-item">Upload your product catalog with pricing</div>
              <div class="checklist-item">Set up shipping zones and rates</div>
              <div class="checklist-item">Connect your bank account for payouts</div>
              <div class="checklist-item">Review and accept marketplace terms</div>
              <div class="checklist-item">Launch your storefront!</div>
            </div>

            <center>
              <a href="${data.onboardingUrl}" class="button">Start Onboarding →</a>
            </center>
          </div>

          <div class="section">
            <h3 class="section-title">Your Success Manager</h3>
            <div class="info-box">
              <p style="margin: 0 0 10px 0;">
                <strong>${data.successManagerName}</strong> will be your dedicated success manager throughout onboarding and beyond.
              </p>
              <p style="margin: 0;">
                Have questions? Email ${data.successManagerName} at
                <a href="mailto:${data.successManagerEmail}" style="color: #4F46E5; text-decoration: none;">
                  ${data.successManagerEmail}
                </a>
              </p>
            </div>
          </div>

          <div class="section">
            <h3 class="section-title">Timeline</h3>
            <div class="timeline">
              <p style="margin: 0 0 10px 0;"><strong>Week 1:</strong> Complete profile and upload products</p>
              <p style="margin: 0 0 10px 0;"><strong>Week 2:</strong> Configure shipping, payments, and terms</p>
              <p style="margin: 0;"><strong>Launch:</strong> Your storefront goes live to 500+ spa partners</p>
            </div>
          </div>

          <div class="info-box">
            <strong>💡 Pro Tip:</strong> Vendors who complete onboarding within 1 week see their first orders 3x faster. Start today!
          </div>
        </div>

        <div class="footer">
          <p>Welcome to JADE Marketplace!</p>
          <p>
            Questions? Visit our <a href="https://help.jademarketplace.com/vendors">Vendor Help Center</a>
          </p>
          <p style="margin-top: 20px; font-size: 12px; color: #9CA3AF;">
            This email was sent to you because you applied to become a vendor on JADE Marketplace.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, body };
}

/**
 * Conditional Approval Email
 *
 * Sent when vendor application is approved with conditions.
 */
export function generateConditionalApprovalEmail(data: {
  vendorName: string;
  brandName: string;
  conditions: string[];
  onboardingUrl: string;
  successManagerEmail: string;
}): { subject: string; body: string } {
  const subject = `✅ Your ${data.brandName} Application is Conditionally Approved`;

  const conditionsList = data.conditions
    .map((condition) => `<li style="margin: 8px 0;">${condition}</li>`)
    .join('');

  const body = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); color: white; padding: 40px 20px; text-align: center; }
        .content { padding: 40px 30px; }
        .warning-banner { background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 20px; margin: 20px 0; }
        .conditions-list { background: #F9FAFB; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .button { display: inline-block; background: #4F46E5; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
        .footer { text-align: center; color: #6B7280; font-size: 14px; padding: 30px 20px; background: #F9FAFB; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>JADE Marketplace</h1>
        </div>
        <div class="content">
          <h2 style="color: #F59E0B;">✅ Conditional Approval</h2>
          <p>Hi ${data.vendorName},</p>
          <p>
            Great news! Your ${data.brandName} application has been approved with a few conditions that need to be addressed during onboarding.
          </p>

          <div class="warning-banner">
            <strong>Please address the following before launch:</strong>
          </div>

          <div class="conditions-list">
            <ul style="margin: 0; padding-left: 20px;">
              ${conditionsList}
            </ul>
          </div>

          <p>
            These conditions are typically addressed during the onboarding process. Your success manager will guide you through each requirement.
          </p>

          <center>
            <a href="${data.onboardingUrl}" class="button">Start Onboarding</a>
          </center>

          <p style="margin-top: 30px;">
            Questions? Reply to this email or contact
            <a href="mailto:${data.successManagerEmail}">${data.successManagerEmail}</a>
          </p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} JADE Marketplace. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, body };
}

/**
 * Onboarding Reminder Email (Task E.1.12)
 *
 * Sent when vendor hasn't completed onboarding within target timeframe.
 */
export function generateOnboardingReminderEmail(data: {
  vendorName: string;
  brandName: string;
  daysElapsed: number;
  completedSteps: number;
  totalSteps: number;
  requiredStepsRemaining: number;
  onboardingUrl: string;
  successManagerName: string;
  successManagerEmail: string;
}): { subject: string; body: string } {
  const isUrgent = data.daysElapsed >= 14;
  const percentComplete = Math.round((data.completedSteps / data.totalSteps) * 100);

  const subject = isUrgent
    ? `⚠️ Finish Your ${data.brandName} Onboarding - ${data.requiredStepsRemaining} Steps Left`
    : `Don't forget to complete your ${data.brandName} onboarding`;

  const body = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); color: white; padding: 40px 20px; text-align: center; }
        .content { padding: 40px 30px; }
        .progress-bar { background: #E5E7EB; height: 30px; border-radius: 15px; overflow: hidden; margin: 20px 0; position: relative; }
        .progress-fill { background: linear-gradient(90deg, #10B981 0%, #059669 100%); height: 100%; transition: width 0.3s; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; }
        .urgent-banner { background: #FEE2E2; border-left: 4px solid #DC2626; padding: 20px; margin: 20px 0; }
        .button { display: inline-block; background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
        .stats { display: flex; justify-content: space-around; margin: 30px 0; }
        .stat { text-align: center; }
        .stat-number { font-size: 36px; font-weight: bold; color: #4F46E5; }
        .stat-label { font-size: 14px; color: #6B7280; }
        .footer { text-align: center; color: #6B7280; font-size: 14px; padding: 30px 20px; background: #F9FAFB; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>JADE Marketplace</h1>
        </div>
        <div class="content">
          <h2>${isUrgent ? '⚠️' : '👋'} Hi ${data.vendorName},</h2>

          ${isUrgent ? `
            <div class="urgent-banner">
              <strong>Action Required:</strong> It's been ${data.daysElapsed} days since your ${data.brandName} application was approved. You're close to launching!
            </div>
          ` : `
            <p>
              You started onboarding for ${data.brandName} ${data.daysElapsed} day${data.daysElapsed !== 1 ? 's' : ''} ago.
              Great progress so far – let's get you across the finish line!
            </p>
          `}

          <div class="stats">
            <div class="stat">
              <div class="stat-number">${data.completedSteps}/${data.totalSteps}</div>
              <div class="stat-label">Steps Completed</div>
            </div>
            <div class="stat">
              <div class="stat-number">${data.requiredStepsRemaining}</div>
              <div class="stat-label">Required Steps Left</div>
            </div>
            <div class="stat">
              <div class="stat-number">${data.daysElapsed}</div>
              <div class="stat-label">Days Elapsed</div>
            </div>
          </div>

          <div class="progress-bar">
            <div class="progress-fill" style="width: ${percentComplete}%">
              ${percentComplete}%
            </div>
          </div>

          <p style="font-size: 16px; margin: 30px 0;">
            You're <strong>${percentComplete}% complete</strong>!
            Most vendors finish onboarding in under 2 weeks and see their first orders within days of launching.
          </p>

          <center>
            <a href="${data.onboardingUrl}" class="button">Complete Onboarding →</a>
          </center>

          <p style="margin-top: 30px; padding: 20px; background: #EFF6FF; border-radius: 8px;">
            <strong>Need help?</strong> Your success manager ${data.successManagerName} is here to assist.
            Reply to this email or reach out at
            <a href="mailto:${data.successManagerEmail}" style="color: #4F46E5;">
              ${data.successManagerEmail}
            </a>
          </p>

          ${isUrgent ? `
            <p style="color: #DC2626; font-size: 14px; margin-top: 20px;">
              <strong>Note:</strong> Applications inactive for more than 30 days may need to be resubmitted.
            </p>
          ` : ''}
        </div>
        <div class="footer">
          <p>You're receiving this because you have an active vendor onboarding in progress.</p>
          <p style="margin-top: 10px;">© ${new Date().getFullYear()} JADE Marketplace</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, body };
}

/**
 * Application Rejection Email
 *
 * Sent when vendor application is rejected.
 */
export function generateApplicationRejectionEmail(data: {
  vendorName: string;
  brandName: string;
  rejectionReason: string;
  canReapply: boolean;
}): { subject: string; body: string } {
  const subject = `Update on Your ${data.brandName} Application`;

  const body = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: #6B7280; color: white; padding: 40px 20px; text-align: center; }
        .content { padding: 40px 30px; }
        .reason-box { background: #FEF2F2; border-left: 4px solid #DC2626; padding: 20px; margin: 20px 0; }
        .reapply-box { background: #DBEAFE; border-left: 4px solid #3B82F6; padding: 20px; margin: 20px 0; }
        .footer { text-align: center; color: #6B7280; font-size: 14px; padding: 30px 20px; background: #F9FAFB; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>JADE Marketplace</h1>
        </div>
        <div class="content">
          <h2>Application Decision</h2>
          <p>Hi ${data.vendorName},</p>
          <p>
            Thank you for your interest in joining JADE Marketplace with ${data.brandName}.
            After careful review, we've decided not to approve your application at this time.
          </p>

          <div class="reason-box">
            <strong>Reason:</strong>
            <p style="margin: 10px 0 0 0;">${data.rejectionReason}</p>
          </div>

          ${data.canReapply ? `
            <div class="reapply-box">
              <strong>You Can Reapply</strong>
              <p style="margin: 10px 0 0 0;">
                We encourage you to address the feedback above and reapply once you've made the necessary improvements.
              </p>
            </div>
          ` : `
            <p>Based on our current curation criteria, we don't believe ${data.brandName} is the right fit for JADE Marketplace at this time.</p>
          `}

          <p style="margin-top: 30px;">
            We appreciate your interest in partnering with us and wish you the best with your business.
          </p>

          <p style="margin-top: 20px;">
            If you have questions about this decision, please reply to this email.
          </p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} JADE Marketplace</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, body };
}

/**
 * Additional Information Request Email
 *
 * Sent when admin requests more information from vendor.
 */
export function generateInfoRequestEmail(data: {
  vendorName: string;
  brandName: string;
  requestDetails: string;
  applicationUrl: string;
  slaDeadline: Date;
}): { subject: string; body: string } {
  const subject = `Additional Information Needed for ${data.brandName} Application`;

  const deadlineStr = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(data.slaDeadline);

  const body = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); color: white; padding: 40px 20px; text-align: center; }
        .content { padding: 40px 30px; }
        .request-box { background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 20px; margin: 20px 0; }
        .button { display: inline-block; background: #4F46E5; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
        .deadline { background: #FEE2E2; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
        .footer { text-align: center; color: #6B7280; font-size: 14px; padding: 30px 20px; background: #F9FAFB; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>JADE Marketplace</h1>
        </div>
        <div class="content">
          <h2>📧 Additional Information Needed</h2>
          <p>Hi ${data.vendorName},</p>
          <p>
            We're reviewing your ${data.brandName} application and need some additional information to continue the process.
          </p>

          <div class="request-box">
            <strong>What we need:</strong>
            <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${data.requestDetails}</p>
          </div>

          <div class="deadline">
            <strong>⏰ Please respond by ${deadlineStr}</strong>
            <p style="margin: 5px 0 0 0; font-size: 14px;">
              Responding quickly helps us complete your review within our 3-day SLA.
            </p>
          </div>

          <center>
            <a href="${data.applicationUrl}" class="button">Respond to Request</a>
          </center>

          <p style="margin-top: 30px;">
            Thank you for your patience. We'll continue your review as soon as we receive this information.
          </p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} JADE Marketplace</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, body };
}
