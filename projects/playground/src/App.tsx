import { useState } from "react";
import { Disclosure } from "./components/Disclosure";
import { Modal } from "./components/Modal";
import { Tabs } from "./components/Tabs";
import "./App.css";

function App() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  return (
    <main className="playground">
      <h1>Accessible components, by hand</h1>
      <p className="lede">Modal, tabs and disclosure, built from scratch against the W3C ARIA Authoring Practices.</p>

      <section>
        <h2>Disclosure</h2>
        <Disclosure summary="What is this?">
          <p>A button that shows and hides a panel. aria-expanded tells a screen reader which state it is in.</p>
        </Disclosure>
      </section>

      <section>
        <h2>Tabs</h2>
        <Tabs
          label="Example tabs"
          tabs={[
            { id: "one", label: "One", content: <p>First panel. Use the arrow keys to move between tabs.</p> },
            { id: "two", label: "Two", content: <p>Second panel. Home and End jump to the first and last tab.</p> },
            { id: "three", label: "Three", content: <p>Third panel. Tab moves from the tab list into this panel.</p> },
          ]}
        />
      </section>

      <section>
        <h2>Modal dialog</h2>
        <button type="button" onClick={() => setModalOpen(true)}>
          Open dialog
        </button>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Send a note"
          description="Focus stays inside this dialog until you close it."
        >
          <label htmlFor="note">Your note</label>
          <input id="note" type="text" />
          <div className="modal-actions">
            <button type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type="button" onClick={() => setModalOpen(false)}>
              Send
            </button>
          </div>
        </Modal>
      </section>
    </main>
  );
}

export default App;
