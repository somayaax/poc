import { isPasswordPolicyCompliant } from './password-policy';

describe('isPasswordPolicyCompliant', () => {
  it('accepts valid passwords', () => {
    expect(isPasswordPolicyCompliant('Aa1!aaaa')).toBe(true);
    expect(isPasswordPolicyCompliant('Str0ng#Pass')).toBe(true);
  });

  it('rejects passwords shorter than 8 characters', () => {
    expect(isPasswordPolicyCompliant('Aa1!aa')).toBe(false);
  });

  it('rejects passwords without uppercase', () => {
    expect(isPasswordPolicyCompliant('aa1!aaaa')).toBe(false);
  });

  it('rejects passwords without lowercase', () => {
    expect(isPasswordPolicyCompliant('AA1!AAAA')).toBe(false);
  });

  it('rejects passwords without a number', () => {
    expect(isPasswordPolicyCompliant('Abc!abcd')).toBe(false);
  });

  it('rejects passwords without a special character', () => {
    expect(isPasswordPolicyCompliant('Abc1abcd')).toBe(false);
  });
});
