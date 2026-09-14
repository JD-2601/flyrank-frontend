import { FormEvent, useState } from "react";
import "./ContactForm.css";

type ContactFields = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type FieldErrors = Partial<Record<keyof ContactFields, string>>;

const INITIAL_VALUES: ContactFields = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: ContactFields): FieldErrors {
  const errors: FieldErrors = {};

  if (values.name.trim().length < 2) {
    errors.name = "Please enter your name (at least 2 characters).";
  }

  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (values.subject.trim().length < 3) {
    errors.subject = "Please enter a subject (at least 3 characters).";
  }

  if (values.message.trim().length < 10) {
    errors.message = "Please enter a message (at least 10 characters).";
  }

  return errors;
}

function ContactForm() {
  const [values, setValues] = useState<ContactFields>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );

  function updateField(field: keyof ContactFields, value: string) {
    setValues((current) => ({ ...current, [field]: value }));

    // Clear the error for this field as the user edits it.
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus("idle");
      return;
    }

    setStatus("submitting");

    try {
      // No backend is wired yet. Simulate a short network delay so the UI
      // can show loading and success states. Do not send form data to a
      // third-party URL until an official API endpoint exists.
      await new Promise((resolve) => setTimeout(resolve, 700));
      console.log("Contact form submitted (client-only):", {
        name: values.name.trim(),
        email: values.email.trim(),
        subject: values.subject.trim(),
        message: values.message.trim(),
      });
      setStatus("success");
      setValues(INITIAL_VALUES);
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="contact-form contact-form--success" role="status">
        <h2>Message sent</h2>
        <p>
          Thanks for reaching out. We received your message and will reply as
          soon as we can.
        </p>
        <button
          type="button"
          className="contact-form__submit"
          onClick={() => setStatus("idle")}
        >
          Send another message
        </button>
      </div>
    );
  }

  const isSubmitting = status === "submitting";

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-form__field">
        <label htmlFor="contact-name">
          Name <span aria-hidden="true">*</span>
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          value={values.name}
          onChange={(event) => updateField("name", event.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          disabled={isSubmitting}
        />
        {errors.name ? (
          <p id="contact-name-error" className="contact-form__error">
            {errors.name}
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
          value={values.email}
          onChange={(event) => updateField("email", event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          disabled={isSubmitting}
        />
        {errors.email ? (
          <p id="contact-email-error" className="contact-form__error">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div className="contact-form__field">
        <label htmlFor="contact-subject">
          Subject <span aria-hidden="true">*</span>
        </label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          value={values.subject}
          onChange={(event) => updateField("subject", event.target.value)}
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={errors.subject ? "contact-subject-error" : undefined}
          disabled={isSubmitting}
        />
        {errors.subject ? (
          <p id="contact-subject-error" className="contact-form__error">
            {errors.subject}
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
          value={values.message}
          onChange={(event) => updateField("message", event.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          disabled={isSubmitting}
        />
        {errors.message ? (
          <p id="contact-message-error" className="contact-form__error">
            {errors.message}
          </p>
        ) : null}
      </div>

      {status === "error" ? (
        <p className="contact-form__error" role="alert">
          Something went wrong. Please try again.
        </p>
      ) : null}

      <button
        className="contact-form__submit"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

export default ContactForm;
