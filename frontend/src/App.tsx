import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@/providers/QueryClientProvider";
import Router from "./Router";

function App() {
  return (
    <QueryClientProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
