import LayoutAdmin from "@/layout/layout-admin";
import { Route, Routes } from "react-router";
import Home from "./home";
import Paciente from "./page/paciente";
import FormCrearPaciente from "./page/views/form-crear-paciente";
import EquipoHome from "./page/equipo/equipo-home";
import FormEquipo from "./page/equipo/views/form-equipo";

export default function AdminRouter() {
  return (
    <LayoutAdmin>
      <Routes>
        <Route index element={<Home />} />
        <Route path="paciente" element={<Paciente />} />
        <Route path="inventario" element={<Home />} />
        <Route path="asignacion" element={<Home />} />
        <Route path="crear-paciente" element={<FormCrearPaciente />} />
        <Route path="equipo"  >
          <Route path="crear-equipo" element={<FormEquipo />} />
          <Route index element={<EquipoHome />} />
        </Route>
      </Routes>
    </LayoutAdmin>
  );
}
