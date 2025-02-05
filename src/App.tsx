import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Navigate, Route, Routes } from "react-router";
import "./App.css";
import LoginPage from "./page/auth/login";
import RegisterPage from "./page/auth/registro";
import AdminRouter from "./page/modules/admin/router";
import ProtectedRoute from "./page/auth/private/auth-private";
const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route index element={<Navigate to="/login" />} />
        <Route path="/admin/*"  element={<ProtectedRoute />}>
          <Route path="*" element={<AdminRouter />} />
        </Route>
      </Routes>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
