import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Disclosure } from "../Disclosure";
import { Modal } from "../Modal";
import { Tabs } from "../Tabs";

describe("Disclosure (keyboard only)", () => {
  it("toggles with Enter and Space and keeps aria-expanded in sync", async () => {
    const user = userEvent.setup();
    render(<Disclosure summary="More">Hidden text</Disclosure>);
    const button = screen.getByRole("button", { name: /more/i });

    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("Hidden text")).not.toBeVisible();

    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Hidden text")).toBeVisible();

    await user.keyboard(" ");
    expect(button).toHaveAttribute("aria-expanded", "false");
  });
});

describe("Tabs (keyboard only)", () => {
  const tabs = [
    { id: "a", label: "A", content: <p>Panel A</p> },
    { id: "b", label: "B", content: <p>Panel B</p> },
    { id: "c", label: "C", content: <p>Panel C</p> },
  ];

  it("has one tab stop, then arrows, Home and End move focus and selection", async () => {
    const user = userEvent.setup();
    render(<Tabs tabs={tabs} label="Demo" />);
    const [a, b, c] = screen.getAllByRole("tab");

    await user.tab();
    expect(a).toHaveFocus();
    expect(a).toHaveAttribute("aria-selected", "true");
    expect(b).toHaveAttribute("tabindex", "-1");

    await user.keyboard("{ArrowRight}");
    expect(b).toHaveFocus();
    expect(b).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Panel B")).toBeVisible();
    expect(screen.getByText("Panel A")).not.toBeVisible();

    await user.keyboard("{End}");
    expect(c).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(a).toHaveFocus();
    await user.keyboard("{ArrowLeft}");
    expect(c).toHaveFocus();
    await user.keyboard("{Home}");
    expect(a).toHaveFocus();
  });

  it("Tab moves from the selected tab into its panel", async () => {
    const user = userEvent.setup();
    render(<Tabs tabs={tabs} label="Demo" />);
    await user.tab();
    await user.tab();
    expect(screen.getByRole("tabpanel")).toHaveFocus();
  });

  it("links each tab and panel with aria-controls and aria-labelledby", () => {
    render(<Tabs tabs={tabs} label="Demo" />);
    const tab = screen.getAllByRole("tab")[0];
    const panelId = tab.getAttribute("aria-controls");
    const panel = document.getElementById(panelId ?? "");
    expect(panel).toHaveAttribute("aria-labelledby", tab.id);
  });
});

function Harness() {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div id="root">
      <button type="button" onClick={() => setOpen(true)}>
        Open
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Title" description="Desc">
        <input aria-label="Note" />
        <button type="button">Send</button>
      </Modal>
    </div>
  );
}

describe("Modal (keyboard only)", () => {
  it("moves focus in, traps Tab both ways, closes on Escape, returns focus to the opener", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const opener = screen.getByRole("button", { name: "Open" });

    await user.tab();
    expect(opener).toHaveFocus();
    await user.keyboard("{Enter}");

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleName("Title");
    expect(dialog).toHaveAccessibleDescription("Desc");

    const close = screen.getByRole("button", { name: "Close dialog" });
    const send = screen.getByRole("button", { name: "Send" });
    expect(close).toHaveFocus();
    expect(document.getElementById("root")).toHaveAttribute("inert");

    await user.tab(); // input
    await user.tab(); // Send
    expect(send).toHaveFocus();
    await user.tab(); // wraps to first
    expect(close).toHaveFocus();
    await user.tab({ shift: true }); // wraps to last
    expect(send).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
    expect(document.getElementById("root")).not.toHaveAttribute("inert");
  });
});
