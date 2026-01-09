import { SettingsProvider } from "./context/settingContext";
import Dashboard from "./components/dashboard";
import SoundProvider from "./context/soundContext";

const App = () => {
  return (
    <SettingsProvider>
       <SoundProvider>
          <Dashboard />
      </SoundProvider>
    </SettingsProvider>
  );
}

export default App;
