# Email Verification Template

This document describes the email verification template used in the SafeCircle app.

## Overview

The verification email template is a custom HTML email that follows the SafeCircle design language with dark backgrounds and purple accents. It provides users with a clear way to verify their email address when signing up.

## Template Location

The template is defined in `lib/email-templates/verification-email.ts` and is used by the authentication system in `lib/auth.ts`.

## Design Elements

- **Color Scheme**: Dark background with purple accents (#8b5cf6, #7c3aed)
- **Typography**: Helvetica Neue, Helvetica, Arial, sans-serif
- **Button**: Gradient button with hover effect
- **Security Note**: Highlighted box with security tips
- **Logo**: SafeCircle logo in SVG format

## Usage

The template is used automatically as part of the email verification process. When a user signs up, the system sends this email to verify their email address.

## Template Parameters

- `userName`: The user's name (if available)
- `verificationUrl`: The URL the user should click to verify their email

## Example

To test this template, create a new user account in the system, and you'll receive the verification email.

## Customization

To update the design or content of the email:

1. Edit `lib/email-templates/verification-email.ts`
2. Modify the HTML and CSS as needed
3. Test the changes by creating a new user account

## Preview

The email includes:
- SafeCircle logo
- Greeting with the user's name
- Brief explanation about verification
- Prominent verification button
- Security tip
- Footer with company information
