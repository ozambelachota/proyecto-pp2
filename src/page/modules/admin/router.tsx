import LayoutAdmin from "@/layout/layout-admin";
import { Route, Routes } from "react-router";
import Home from "./home";
import Paciente from "./page/paciente";
import FormCrearPaciente from "./page/views/form-crear-paciente";

export default function AdminRouter() {
  return (
    <LayoutAdmin>
      <Routes>
        <Route index element={<Home />} />
        <Route path="paciente" element={<Paciente />} />
        <Route path="inventario" element={<Home />} />
        <Route path="asignacion" element={<Home />} />
        <Route path="crear-paciente" element={<FormCrearPaciente />} />
      </Routes>
    </LayoutAdmin>
  );
}
