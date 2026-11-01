import { useId, useState, type ReactNode } from "react";

type DisclosureProps = {
  summary: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

// W3C APG "Disclosure" pattern: a button with aria-expanded that controls a panel.
// Enter and Space come for free because it is a real <button>.
export function Disclosure({ summary, children, defaultOpen = false }: DisclosureProps) {
  const [open, setOpen] = useState<boolean>(defaultOpen);
  const panelId = useId();

  return (
    <div className="disclosure">
      <button
        type="button"
        className="disclosure-button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span aria-hidden="true">{open ? "▾" : "▸"}</span> {summary}
      </button>
      <div id={panelId} className="disclosure-panel" hidden={!open}>
        {children}
      </div>
    </div>
  );
}
