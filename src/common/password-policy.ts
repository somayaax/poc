/**
 * Enforces: min 8 chars, uppercase, lowercase, number, special character.
 * Matches LLD / analyst password policy.
 */
const PASSWORD_POLICY_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export function isPasswordPolicyCompliant(password: string): boolean {
  return PASSWORD_POLICY_REGEX.test(password);
}
