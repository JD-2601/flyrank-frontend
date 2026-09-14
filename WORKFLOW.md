Workflow: Vague vs. Precise Prompt — Contact Form
The drill

I built the same feature — a contact form with name, email, and message fields — twice, on two separate branches, using Cursor's AI agent.

Round one (vague-prompt-round): a single, deliberately lazy prompt — "make me a contact form." No context, no constraints.
Round two (precice-prompt-round): a fresh branch, a fresh chat session, and a detailed prompt specifying exact fields, validation rules (required fields, email pattern, 10-character minimum message), inline error display, accessibility requirements, and an explicit instruction to write and run tests as a verification step.
Correctness

Round one produced a working form, but with no explicit validation spec, I couldn't be sure the AI's assumptions about "valid" input matched what I actually needed — it made its own judgment calls about what counted as an error. Round two's validation logic (validateContactForm.ts) was built to a specification I wrote, and its correctness was actually provable: I ran the generated test suite and watched 5/5 tests pass, covering empty fields, malformed email, and short messages. Round one had no equivalent confirmation — I would have had to test it manually, field by field, to trust it.

Accessibility

Round two explicitly included aria-invalid and aria-describedby on every input, tied to visible error messages with role="alert". This wasn't something round one's vague prompt requested, so I can't assume it's present — accessibility isn't something AI tools reliably add by default unless asked for directly.

Edge cases

Round two's requirements forced explicit handling of edge cases I hadn't thought to ask for in round one: whitespace-only input treated as empty, messages under 10 characters, and malformed (but non-empty) email addresses. Round one's single-sentence prompt left these entirely up to the AI's discretion, with no way for me to know what it decided without reading every line of generated code closely.

Review effort

This was the clearest difference. Round one took almost no time to generate, but I had no real way to trust it without doing my own manual review of the validation behavior — effectively redoing the thinking I skipped in the prompt. Round two took longer to write the prompt, but the review effort afterward was much lower: the test suite did the verification for me. The AI mistake I caught: in round two, my initial prompt didn't specify what should happen on repeated invalid submissions, and the agent made a reasonable but unstated assumption (clearing touched-state only on successful submit) that I had to notice and accept deliberately, rather than it being something I'd explicitly asked for.

Rule learned

"Used AI to build it" isn't a skill — writing a prompt precise enough that its output can be verified without re-deriving the logic myself is. I've added this as a new rule in .cursorrules.