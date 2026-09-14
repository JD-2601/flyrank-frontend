export type ContactFields = {
  name: string;
  email: string;
  message: string;
};

export type FieldErrors = Partial<Record<keyof ContactFields, string>>;

/** Simple email check: local@domain.tld with no spaces. */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MIN_MESSAGE_LENGTH = 10;

/**
 * Returns an error message for each invalid field.
 * Empty / whitespace-only values are treated as missing.
 */
export function validateContactForm(values: ContactFields): FieldErrors {
  const errors: FieldErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const message = values.message.trim();

  if (!name) {
    errors.name = "Please enter your name.";
  }

  if (!email) {
    errors.email = "Please enter your email address.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!message) {
    errors.message = "Please enter a message.";
  } else if (message.length < MIN_MESSAGE_LENGTH) {
    errors.message = `Please enter a message (at least ${MIN_MESSAGE_LENGTH} characters).`;
  }

  return errors;
}

export function isContactFormValid(values: ContactFields): boolean {
  return Object.keys(validateContactForm(values)).length === 0;
}
