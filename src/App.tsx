import ContactForm from "./components/ContactForm";
import "./App.css";

function App() {
  return (
    <main className="app">
      <header className="app__header">
        <p className="app__eyebrow">FlyRank</p>
        <h1>Get in touch</h1>
        <p className="app__lede">
          Send a message and we will get back to you. Required fields are marked
          with an asterisk.
        </p>
      </header>
      <ContactForm />
    </main>
  );
}

export default App;
