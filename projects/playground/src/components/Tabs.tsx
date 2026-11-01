import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export type TabItem = {
  id: string;
  label: string;
  content: ReactNode;
};

type TabsProps = {
  tabs: TabItem[];
  label: string;
  defaultId?: string;
};

// W3C APG "Tabs" pattern, automatic activation, horizontal.
// Roving tabindex: only the selected tab is in the Tab order; arrows move between tabs.
export function Tabs({ tabs, label, defaultId }: TabsProps) {
  const base = useId();
  const [activeId, setActiveId] = useState<string>(defaultId ?? tabs[0].id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const goTo = (index: number) => {
    const next = tabs[(index + tabs.length) % tabs.length];
    setActiveId(next.id);
    tabRefs.current[next.id]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        goTo(index + 1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        goTo(index - 1);
        break;
      case "Home":
        event.preventDefault();
        goTo(0);
        break;
      case "End":
        event.preventDefault();
        goTo(tabs.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div className="tabs">
      <div role="tablist" aria-label={label} className="tablist">
        {tabs.map((tab, index) => {
          const selected = tab.id === activeId;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el;
              }}
              type="button"
              role="tab"
              id={`${base}-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${base}-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              className="tab"
              onClick={() => setActiveId(tab.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${base}-panel-${tab.id}`}
          aria-labelledby={`${base}-tab-${tab.id}`}
          tabIndex={0}
          hidden={tab.id !== activeId}
          className="tabpanel"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
