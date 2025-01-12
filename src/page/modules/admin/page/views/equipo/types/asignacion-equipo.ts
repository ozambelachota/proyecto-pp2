export interface  IAsignacionEquipo {
  id?: number;
  equipo_id: number;
  paciente_id: number;
  fecha_asignacion: Date;
  direccion: string;
}
export interface IAsignacionEquipoWithEquipo  {
  id: number;
  equipo_id: number;
  paciente_id: number;
  fecha_asignacion: Date;
  direccion: string;
  equipos: {
    id: number;
    nombre: string;
    marca: string;
    modelo: string;
    numero_serie: string;
    disponible: boolean;
    tipo_equipo_id: number;
  };
}