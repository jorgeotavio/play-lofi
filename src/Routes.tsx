import { BrowserRouter, Route, Routes as RROuter } from "react-router-dom";
import Home from "./pages/Home";

function Routes() {
  return (
    <BrowserRouter>
      <RROuter>
        <Route path="/" element={<Home />} />
      </RROuter>
    </BrowserRouter>
  );
}

export default Routes;
