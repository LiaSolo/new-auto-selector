import './App.scss';
import {
    Routes,
    Route, BrowserRouter,
} from "react-router-dom";
import SemiFinal from "./pages/SemiFinal";
import Final from "./pages/Final";
import Settings from "./pages/Settings";
import Release from './pages/Release';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/settings" element={<Settings/>}/>
                <Route path="/settings/release" element={<Release/>}/>
                <Route path="/semi" element={<SemiFinal/>}/>
                <Route path="/final" element={<Final/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
