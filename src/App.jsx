import './App.css';
//import './fonts/stylesheet.css'
import {
    Routes,
    Route, BrowserRouter,
} from "react-router-dom";
import SemiFinal from "./pages/SemiFinal";
// import Final from "./pages/Final";
import SemiSettings from "./pages/SemiSettings";
// import FinalSettings from "./pages/FinalSettings [raw]";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/semi-settings" element={<SemiSettings/>}/>
                <Route path="/semi-final" element={<SemiFinal/>}/>
                {/* <Route path="/final" element={<Final/>}/>
                <Route path="/final-settings" element={<FinalSettings/>}/> */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
