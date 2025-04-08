import type {Data} from "./type";

const api = {
    match: {
      list: async (): Promise<Data[]> => {
        return fetch(
          "https://docs.google.com/spreadsheets/d/e/2PACX-1vSUS_RpCKnY0yfHnbKt9i2xaGjtAC8g-rOkGruxFCYrQMh2-UAt9dq8AYfsG8Ao9UYIsNaB3tu3-1D2/pub?gid=0&single=true&output=csv",
        ).then(res => res.text())
        .then(text =>{
        return text.split("\n").slice(1).map(row => {
            const [id, FECHA, numero, descripcion ] = row.split (",")
            return{
                id,
                FECHA,
                numero: parseInt(numero),
                descripcion,

            }
        })
        })
        }
      },

    }
    
  
  
  export default api;
  