# Email Templates

This directory contains Handlebars email templates for transactional emails.

Vendure's Email Plugin will look for templates here with the following naming convention:
- `order-confirmation/body.hbs` - Order confirmation email
- `order-confirmation/subject.hbs` - Subject line for order confirmation
- `email-verification/body.hbs` - Email verification
- `password-reset/body.hbs` - Password reset
- etc.

## Template Variables

Templates have access to:
- `{{fromAddress}}` - Sender email address
- `{{verifyEmailAddressUrl}}` - Email verification URL
- `{{passwordResetUrl}}` - Password reset URL
- Additional context based on the event type

## Example

```handlebars
<html>
<body>
  <h1>Welcome to JADE Spa Marketplace</h1>
  <p>Please verify your email address:</p>
  <a href="{{verifyEmailAddressUrl}}">Verify Email</a>
</body>
</html>
```
