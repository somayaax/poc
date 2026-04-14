# 📝 CURRENT_TASK.md
**Jira ID:** TEST-1099
**Feature:** Change password from profile settings

## 📋 Requirements (from Analyst)
User:
Authenticated user

Interface:
Profile settings

Description:
Allow authenticated users to change their password from profile settings. The user must provide their current password before setting a new password. The new password must comply with the defined password policy.

Acceptance Criteria:
- User can access a change password option from profile settings.
- System requires entry of current password, new password, and confirm password.
- System verifies that the entered current password is correct before allowing the change.
- System updates the password only when the new password and confirm password match.
- System allows the change only when the new password meets the password policy.
- After successful password change, the system confirms the update to the user.
- Password change action is logged.

Validations / Limitations:
- Current password is required.
- New password is required.
- Confirm password is required.
- New password must be at least 8 characters and include uppercase, lowercase, number, and special character.
- Confirm password must exactly match the new password.
- If the current password is incorrect, the password must not be changed.
- This story applies to authenticated users changing their own password via profile settings.

## 🏗️ LLD (from Architect)
# Low-Level Design Document for TEST-1099: Change Password from Profile Settings

## Overview
This document outlines the low-level design for implementing the feature that allows authenticated users to change their password from the profile settings. The design includes UI flow, backend API specifications, password policy validation, security considerations, and error handling.

## Data Models and Database Schema Changes

### User Table
No changes are needed to the existing `User` table structure. The table should already include:
- `user_id`: Primary Key
- `password_hash`: Stores the hashed password
- `last_password_change`: Timestamp of the last password change

## API Design

### Endpoint: Change Password

- **URL**: `/api/v1/users/change-password`
- **Method**: POST
- **Authentication**: Bearer Token (JWT)
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`

#### Request Body
```json
{
  "currentPassword": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}
```

#### Response
- **Success (200 OK)**
  ```json
  {
    "message": "Password changed successfully."
  }
  ```

- **Client Errors (4xx)**
  - 400 Bad Request: Invalid input data
  - 401 Unauthorized: Invalid current password
  - 422 Unprocessable Entity: Password policy violation

- **Server Errors (5xx)**
  - 500 Internal Server Error: Unexpected error

## Key Architectural Decisions and Rationale

### Password Hashing
- Use a strong hashing algorithm like bcrypt with a suitable work factor to hash passwords.
- Store only the hash in the database, never the plaintext password.

### Password Policy Validation
- Enforce a strong password policy: minimum 8 characters, including uppercase, lowercase, numbers, and special characters.
- Use regex for client-side validation and enforce server-side validation to ensure compliance.

### Current Password Verification
- Compare the provided `currentPassword` against the stored hash using bcrypt's compare function.

### Audit Logging
- Log the password change action with user ID and timestamp for audit purposes.
- Do not log the passwords or hashes.

### Error Handling
- Return specific error messages for invalid current password and password policy violations.
- Ensure generic error messages for unexpected server errors to avoid information leakage.

### Security Controls
- Implement rate limiting on the change password endpoint to mitigate brute force attacks.
- Ensure session management practices are followed, such as invalidating sessions on password change if applicable.

### UI Flow
1. **Access Profile Settings**: User navigates to their profile settings page.
2. **Change Password Form**: User is presented with fields to enter their current password, new password, and confirm password.
3. **Validation**: Client-side validation checks for password strength and matching new/confirm passwords.
4. **Submit Request**: Upon submission, the form sends a POST request to the backend API.
5. **Feedback**: User receives feedback on success or error messages in the UI.

### Test Considerations
- Unit tests for password policy validation functions.
- Integration tests for the API endpoint covering success and failure scenarios.
- Security tests for rate limiting and session handling.
- UI tests for form validation and user feedback.

By adhering to these design elements, we ensure a secure, user-friendly, and robust implementation of the password change feature from profile settings.

## 🚀 Post-Implementation Steps
1. **Verify**: Run test to ensure all changes pass.
2. **Commit**: Stage all changes and commit with prefix "feat: [JiraID]".
3. **Push**: Push this branch to origin.

cursor prompt: Using @CURRENT_TASK.md as the guide, implement the backend logic. Ensure you follow the LLD exactly. After implementation, follow the post-implementation steps exactly.
---
*Generated by GRCEEK Workflow. Use '@CURRENT_TASK.md' in Cursor Composer to implement.*