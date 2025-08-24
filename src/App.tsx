import { FSProvider } from "./state/fsContext";
import { Tree } from "./components/Tree";
import { Toasts } from "./components/Toasts";
import "./App.css";

function App() {
  return (
    <FSProvider>
      <div className="app">
        <header className="app-header">
          <h1>🗂️ Pindo File Manager</h1>
        </header>
        <main className="app-main">
          <Tree />
        </main>
        <Toasts />
      </div>
    </FSProvider>
  );
}

export default App;
