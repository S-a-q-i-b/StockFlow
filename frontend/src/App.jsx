import { Toaster } from "sonner";
import RouteTransition from "./components/common/RouteTransition";
import AppRoutes from "./routes/AppRoutes";

const App = () => (
  <RouteTransition>
    <AppRoutes />
    <Toaster richColors position="top-right" closeButton />
  </RouteTransition>
);

export default App;
