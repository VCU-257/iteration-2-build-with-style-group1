import { Outlet } from "react-router-dom";
import Dock from "./components/Dock/Dock";
import Header from "./components/Header/Header";
import "./App.css";

function App() {
  return (
    <div className="flex flex-col h-dvh">
      <header className="shrink-0">
        <Header />
      </header>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <Dock />
    </div>
  );
}

export default App;
