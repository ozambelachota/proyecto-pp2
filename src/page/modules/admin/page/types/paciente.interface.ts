export interface IPaciente {
  id?: number;
  dni: string;
  nombre: string;
  apellido: string;
  genero: string;
  fecha_nacimiento: Date;
  telefono: string;
  direccion: string;      
}