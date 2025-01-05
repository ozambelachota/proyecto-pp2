import axios from "axios";

export interface PersonaDni {
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  tipoDocumento: string;
  numeroDocumento: string;
  digitoVerificador: string;
}

export const apiNetDniService = async (dni: string): Promise<PersonaDni> => {
  return await axios.get(
    `https://api.apis.net.pe/v2/reniec/dni?numero=${dni}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `${import.meta.env.VITE_API_TOKEN_APINET}`,
        "Content-Type": "application/json",
      },
    }
  );
};
