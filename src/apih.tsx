import type {Datah} from "./type";

const apih = {
    match: {
      list: async (): Promise<Datah[]> => {
        return fetch(
          "https://docs.google.com/spreadsheets/d/e/2PACX-1vSUS_RpCKnY0yfHnbKt9i2xaGjtAC8g-rOkGruxFCYrQMh2-UAt9dq8AYfsG8Ao9UYIsNaB3tu3-1D2/pub?gid=2002735922&single=true&output=csv",
        ).then(res => res.text())
        .then(text =>{
        return text.split("\n").slice(1).map(row => {
            const [IDHABER, CUENTAH, CANTIDADH, RESULTADOH, TIPOH ] = row.split (",")
            return{
                IDHABER,
                CUENTAH,
                CANTIDADH: parseInt(CANTIDADH),
                RESULTADOH,
                TIPOH,

            }
        })
        })
        }
      },
    }
    
  
  
  export default apih;