import {BrowserRouter, Route, Routes} from "react-router-dom";
import BoidsApp from "./codingtrain/BoidsApp";
import ScrollToTop from "./ScrollToTop";
import {Main} from "./main/Main";
import {FlowField} from "./codingtrain/FlowField";
import Blobby from "./codingtrain/Blobby";
import RetirementCalculator from "./pages/RetirementPage";

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Main />}/>
                <Route path="/boids" element={<BoidsApp />}/>
                <Route path="/flow-field" element={<FlowField />}/>
                <Route path="/blobby" element={<Blobby />}/>
                <Route path="/retirement-calculator" element={<RetirementCalculator />}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
