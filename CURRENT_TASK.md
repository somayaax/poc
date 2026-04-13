# 📝 CURRENT_TASK.md
**Jira ID:** IAI-9
**Feature:** Change Password Feature

## 📋 Requirements (from Analyst)
As a User, I want to change my password, so that I can ensure my account remains secure.

### Acceptance Criteria
- Users must be prompted to change their password upon first login for Admin-created accounts.
- Users must verify their current password before setting a new password.
- New password must meet security criteria: at least 10 characters long, containing uppercase, lowercase, numbers, and special characters.
- Confirmation of new password must match the new password field.

### Validations / Limitations
| Field / Action | Validation / Action | Message / Alert |
|---|---|---|
| Current Password | Required and must match user’s existing password | "Incorrect email or password." |
| New Password | Required; must meet security criteria | "Password must be at least 10 characters, including uppercase, lowercase, numbers, and special characters." |
| Confirm Password | Required; must match New Password | "Passwords do not match." |

## 🏗️ LLD (from Architect)
This document outlines the revised design for the Change Password feature, updating the minimum password length requirement to enhance security.

### Data Models and Database Schema Changes

#### User Table
- **Table Name**: `users`
- **Fields**:
  - `id`: UUID (Primary Key)
  - `email`: VARCHAR (Unique)
  - `password_hash`: VARCHAR
  - `status`: ENUM('Active', 'Inactive', 'Pending')
  - `created_at`: TIMESTAMP
  - `updated_at`: TIMESTAMP

#### New Field for Password Change Tracking
- **Table Name**: `password_changes`
- **Fields**:
  - `id`: UUID (Primary Key)
  - `user_id`: UUID (Foreign Key referencing `users.id`)
  - `changed_at`: TIMESTAMP
  - `ip_address`: VARCHAR
  - `user_agent`: VARCHAR

### API Design and Endpoint Specifications

#### Change Password Endpoint
- **Endpoint**: `POST /api/users/change-password`
- **Request Body**:
    ```json
    {
      "current_password": "string",
      "new_password": "string",
      "confirm_password": "string"
    }
    ```
- **Response**:
    - **200 OK**
        ```json
        {
          "message": "Password changed successfully."
        }
        ```
    - **400 Bad Request**
        ```json
        {
          "error": "Invalid input or current password does not match."
        }
        ```

### Security Considerations
- All passwords must be hashed using a secure algorithm (e.g., bcrypt) before storing.
- The API must validate the current password against the stored hash.
- Rate limiting should be implemented to prevent brute-force attacks.

### Key Architectural Decisions and Rationale
1. **Password Storage**: Passwords are stored as hashes rather than plaintext to enhance security and protect user data.
2. **User Verification**: Users must verify their current password before changing it. This adds an additional layer of security.
3. **Input Validation**: Strong validation rules are enforced for new passwords:
   - Minimum length of **10 characters**.
   - Must include uppercase letters, lowercase letters, numbers, and special characters to prevent weak passwords.
4. **Audit Trail**: A separate `password_changes` table tracks password change events for security audits and compliance requirements.
5. **API Versioning**: The API is designed to accommodate future changes through versioning (e.g., `/api/v1/users/change-password`), allowing backward compatibility.
6. **Error Handling**: Comprehensive error messages are provided to guide users without disclosing sensitive information.

## 🚀 Post-Implementation Steps
1. **Verify**: Run tests to ensure all changes pass.
2. **Commit**: Stage all changes and commit with prefix "feat: IAI-9".
3. **Push**: Push this branch to origin.