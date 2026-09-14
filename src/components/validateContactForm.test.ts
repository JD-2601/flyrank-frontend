import { describe, expect, it } from "vitest";
import { validateContactForm } from "./validateContactForm";

const validValues = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "Hello there, this is long enough.",
};

describe("validateContactForm", () => {
  it("returns errors for empty fields", () => {
    const errors = validateContactForm({
      name: "",
      email: "",
      message: "",
    });

    expect(errors.name).toBe("Please enter your name.");
    expect(errors.email).toBe("Please enter your email address.");
    expect(errors.message).toBe("Please enter a message.");
  });

  it("treats whitespace-only values as empty", () => {
    const errors = validateContactForm({
      name: "   ",
      email: "  ",
      message: "\n\t",
    });

    expect(errors.name).toBeDefined();
    expect(errors.email).toBeDefined();
    expect(errors.message).toBeDefined();
  });

  it("returns an error for an invalid email format", () => {
    const errors = validateContactForm({
      ...validValues,
      email: "not-an-email",
    });

    expect(errors.email).toBe("Please enter a valid email address.");
    expect(errors.name).toBeUndefined();
    expect(errors.message).toBeUndefined();
  });

  it("returns an error when the message is shorter than 10 characters", () => {
    const errors = validateContactForm({
      ...validValues,
      message: "Too short",
    });

    expect(errors.message).toBe(
      "Please enter a message (at least 10 characters)."
    );
    expect(errors.name).toBeUndefined();
    expect(errors.email).toBeUndefined();
  });

  it("returns no errors for a complete, valid form", () => {
    expect(validateContactForm(validValues)).toEqual({});
  });
});
