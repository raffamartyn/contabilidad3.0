import type {Datad} from "./type";

const apid = {
    match: {
      list: async (): Promise<Datad[]> => {
        return fetch(
          "https://docs.google.com/spreadsheets/d/e/2PACX-1vSUS_RpCKnY0yfHnbKt9i2xaGjtAC8g-rOkGruxFCYrQMh2-UAt9dq8AYfsG8Ao9UYIsNaB3tu3-1D2/pub?gid=1320446020&single=true&output=csv",
        ).then(res => res.text())
        .then(text =>{
        return text.split("\n").slice(1).map(row => {
            const [IDDEBE, CUENTAD, CANTIDADD, RESULTADOD, TIPOD ] = row.split (",")
            return{
                IDDEBE,
                CUENTAD,
                CANTIDADD: parseInt(CANTIDADD),
                RESULTADOD,
                TIPOD,

            }
        })
        })
        }
      },
    }
    
  
  
  export default apid;