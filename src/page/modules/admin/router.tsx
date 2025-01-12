import LayoutAdmin from "@/layout/layout-admin";
import { Route, Routes } from "react-router";
import Home from "./home";
import EquipoHome from "./page/equipo/equipo-home";
import FormEquipo from "./page/equipo/views/form-equipo";
import Paciente from "./page/paciente";
import CalendarioEquipo from "./page/views/equipo/calendario-equipo";
import FormCrearPaciente from "./page/views/form-crear-paciente";

export default function AdminRouter() {
  return (
    <LayoutAdmin>
      <Routes>
        <Route index element={<Home />} />
        <Route path="paciente">
          <Route index element={<Paciente />} />
          <Route path="inventario" element={<Home />} />
          <Route path="asignacion" element={<CalendarioEquipo />} />
          <Route path="crear-paciente" element={<FormCrearPaciente />} />
        </Route>

        <Route path="equipo">
          <Route path="crear-equipo" element={<FormEquipo />} />
          <Route index element={<EquipoHome />} />
        </Route>
      </Routes>
    </LayoutAdmin>
  );
}
