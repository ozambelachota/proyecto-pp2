export interface IPaciente {
  id?: number;
  dni: string;
  nombre: string;
  apellido: string;
  genero: "Masculino" | "Femenino";
  fecha_nacimiento: Date;
  telefono: string;
  direccion: string;      
}
export type pacienteFilter = {
  dni?: string;
  nombre?: string;
  apellido?: string;
  genero?: string;
  fecha_nacimiento?: Date;
  telefono?: string;
  direccion?: string;      
}