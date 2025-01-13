import { create } from "zustand";

interface IEquipoStore {
  equipo: {
    id: number;
    nombre: string;
    marca: string;
    modelo: string;
    numero_serie: string;
    disponible: boolean;
    tipo_equipo_id: number;
  };
  setEquipo: (equipo: {
    id: number;
    nombre: string;
    marca: string;
    modelo: string;
    numero_serie: string;
    disponible: boolean;
    tipo_equipo_id: number;
  }) => void;
}
export const useEquipoStore = create<IEquipoStore>()((set) => ({
  equipo: {
    id: 0,
    nombre: "",
    marca: "",
    modelo: "",
    numero_serie: "",
    disponible: true,
    tipo_equipo_id: 0,
  },
  setEquipo: (equipo) => {
    set({ equipo });
  },
}));
