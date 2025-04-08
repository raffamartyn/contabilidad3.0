"use client";

import React, { useEffect, useState } from "react";
import apid from "@/apid";
import apih from "@/apih";
import type { Datad, Datah } from "@/type";
import Link from "next/link";

export default function ResumenCuentasT() {
  const [debits, setDebits] = useState<Datad[]>([]);
  const [credits, setCredits] = useState<Datah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accountSummary, setAccountSummary] = useState<{
    [key: string]: {
      debitos: number;
      creditos: number;
      saldo: number;
    };
  }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [debitData, creditData] = await Promise.all([
          apid.match.list(),
          apih.match.list(),
        ]);

        setDebits(debitData);
        setCredits(creditData);
        calculateAccountSummary(debitData, creditData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateAccountSummary = (debits: Datad[], credits: Datah[]) => {
    const summary: typeof accountSummary = {};

    debits.forEach((debit) => {
      if (!summary[debit.CUENTAD]) {
        summary[debit.CUENTAD] = { debitos: 0, creditos: 0, saldo: 0 };
      }
      summary[debit.CUENTAD].debitos += debit.CANTIDADD;
      summary[debit.CUENTAD].saldo += debit.CANTIDADD;
    });

    credits.forEach((credit) => {
      if (!summary[credit.CUENTAH]) {
        summary[credit.CUENTAH] = { debitos: 0, creditos: 0, saldo: 0 };
      }
      summary[credit.CUENTAH].creditos += credit.CANTIDADH;
      summary[credit.CUENTAH].saldo -= credit.CANTIDADH;
    });

    setAccountSummary(summary);
  };

  if (loading) return <p className="text-center text-gray-600">Cargando datos...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">📋 Mayor de Cuentas (Formato T)</h2>
        <Link href="/" className="text-blue-600 hover:underline">
          ← Volver al Libro Diario
        </Link>
      </div>

      <div className="space-y-8">
        {Object.entries(accountSummary)
          .sort(([cuentaA], [cuentaB]) => cuentaA.localeCompare(cuentaB))
          .map(([cuenta, { debitos, creditos, saldo }]) => (
            <div key={cuenta} className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 border-b">
                <h3 className="font-bold text-lg">{cuenta}</h3>
              </div>
              
              <div className="flex">
                {/* Columna DEBE */}
                <div className="w-1/2 border-r">
                  <div className="bg-green-50 px-4 py-1 border-b">
                    <h4 className="font-semibold text-green-800">DEBE</h4>
                  </div>
                  <div className="p-4">
                    {debits
                      .filter(d => d.CUENTAD === cuenta)
                      .map((debit, index) => (
                        <div key={`${cuenta}-D-${index}`} className="mb-2 last:mb-0">
                          <p className="text-gray-600"></p>
                          <p className="text-green-700 font-medium text-right">
                            ${debit.CANTIDADD.toLocaleString()}
                          </p>
                        </div>
                      ))}
                    
                    {debits.filter(d => d.CUENTAD === cuenta).length === 0 && (
                      <p className="text-gray-400 text-center py-2">No hay movimientos</p>
                    )}
                    
                    <div className="mt-4 pt-2 border-t">
                      <p className="font-bold text-right">
                        Total: ${debitos.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Columna HABER */}
                <div className="w-1/2">
                  <div className="bg-red-50 px-4 py-1 border-b">
                    <h4 className="font-semibold text-red-800">HABER</h4>
                  </div>
                  <div className="p-4">
                    {credits
                      .filter(h => h.CUENTAH === cuenta)
                      .map((credit, index) => (
                        <div key={`${cuenta}-H-${index}`} className="mb-2 last:mb-0">
                          <p className="text-gray-600"></p>
                          <p className="text-red-700 font-medium text-right">
                            ${credit.CANTIDADH.toLocaleString()}
                          </p>
                        </div>
                      ))}
                    
                    {credits.filter(h => h.CUENTAH === cuenta).length === 0 && (
                      <p className="text-gray-400 text-center py-2">No hay movimientos</p>
                    )}
                    
                    <div className="mt-4 pt-2 border-t">
                      <p className="font-bold text-right">
                        Total: ${creditos.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Saldo */}
              <div className={`px-4 py-2 ${
                saldo > 0 ? 'bg-green-50 text-green-800' : 
                saldo < 0 ? 'bg-red-50 text-red-800' : 'bg-blue-50 text-blue-800'
              }`}>
                <p className="font-bold text-center">
                  SALDO: ${Math.abs(saldo).toLocaleString()} 
                  {saldo > 0 ? ' (Deudor)' : saldo < 0 ? ' (Acreedor)' : ' (Cero)'}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}