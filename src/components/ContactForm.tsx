import { FormEvent, useState } from "react";
import {
  ContactFields,
  FieldErrors,
  isContactFormValid,
  validateContactForm,
} from "./validateContactForm";
import "./ContactForm.css";

const INITIAL_VALUES: ContactFields = {
  name: "",
  email: "",
  message: "",
};

type TouchedFields = Partial<Record<keyof ContactFields, boolean>>;

function ContactForm() {
  const [values, setValues] = useState<ContactFields>(INITIAL_VALUES);
  const [touched, setTouched] = useState<TouchedFields>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const fieldErrors = validateContactForm(values);
  const formIsValid = isContactFormValid(values);
  const isSubmitting = status === "submitting";

  function shouldShowError(field: keyof ContactFields): boolean {
    return Boolean(
      fieldErrors[field] && (touched[field] || hasAttemptedSubmit)
    );
  }

  function visibleError(field: keyof ContactFields): string | undefined {
    return shouldShowError(field) ? fieldErrors[field] : undefined;
  }

  function updateField(field: keyof ContactFields, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (status === "success") {
      setStatus("idle");
    }
  }

  function handleBlur(field: keyof ContactFields) {
    setTouched((current) => ({ ...current, [field]: true }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasAttemptedSubmit(true);

    const nextErrors: FieldErrors = validateContactForm(values);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setStatus("submitting");

    // No backend is wired yet. Simulate a short delay so the UI can show
    // a sending state. Do not post form data to a third-party URL until
    // an official API endpoint exists.
    await new Promise((resolve) => setTimeout(resolve, 400));

    setValues(INITIAL_VALUES);
    setTouched({});
    setHasAttemptedSubmit(false);
    setStatus("success");
  }

  const nameError = visibleError("name");
  const emailError = visibleError("email");
  const messageError = visibleError("message");

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      {status === "success" ? (
        <p className="contact-form__success" role="status">
          Thanks for reaching out. Your message was sent, and the form has been
          cleared.
        </p>
      ) : null}

      <div className="contact-form__field">
        <label htmlFor="contact-name">
          Name <span aria-hidden="true">*</span>
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          value={values.name}
          onChange={(event) => updateField("name", event.target.value)}
          onBlur={() => handleBlur("name")}
          aria-invalid={nameError ? true : undefined}
          aria-describedby={nameError ? "contact-name-error" : undefined}
          disabled={isSubmitting}
        />
        {nameError ? (
          <p id="contact-name-error" className="contact-form__error">
            {nameError}
          </p>
        ) : null}
      </div>

      <div className="contact-form__field">
        <label htmlFor="contact-email">
          Email <span aria-hidden="true">*</span>
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={values.email}
          onChange={(event) => updateField("email", event.target.value)}
          onBlur={() => handleBlur("email")}
          aria-invalid={emailError ? true : undefined}
          aria-describedby={emailError ? "contact-email-error" : undefined}
          disabled={isSubmitting}
        />
        {emailError ? (
          <p id="contact-email-error" className="contact-form__error">
            {emailError}
          </p>
        ) : null}
      </div>

      <div className="contact-form__field">
        <label htmlFor="contact-message">
          Message <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          required
          value={values.message}
          onChange={(event) => updateField("message", event.target.value)}
          onBlur={() => handleBlur("message")}
          aria-invalid={messageError ? true : undefined}
          aria-describedby={messageError ? "contact-message-error" : undefined}
          disabled={isSubmitting}
        />
        {messageError ? (
          <p id="contact-message-error" className="contact-form__error">
            {messageError}
          </p>
        ) : null}
      </div>

      <button
        className="contact-form__submit"
        type="submit"
        disabled={!formIsValid || isSubmitting}
      >
        {isSubmitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

export default ContactForm;
