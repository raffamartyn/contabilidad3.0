"use client";

import React, { useEffect, useState, useMemo } from "react";
import apid from "@/apid";
import apih from "@/apih";
import type { Datad, Datah } from "@/type";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ResumenCuentasT() {
  const [debits, setDebits] = useState<Datad[]>([]);
  const [credits, setCredits] = useState<Datah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [accountSummary, setAccountSummary] = useState<{
    [key: string]: {
      debitos: number;
      creditos: number;
      saldo: number;
    };
  }>({});

  // Obtener parámetros de búsqueda
  const searchParams = useSearchParams();
  const idmovimiento = searchParams.get('cuenta');

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

        // Si hay un ID en los parámetros, resaltarlo
        if (idmovimiento) {
          setHighlightedId(idmovimiento);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idmovimiento]);

  // Efecto para scroll automático al elemento destacado
  useEffect(() => {
    if (highlightedId) {
      setTimeout(() => {
        const element = document.getElementById(`cuenta-${highlightedId}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }, [highlightedId, debits, credits]);

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

  const filteredAccounts = useMemo(() => {
    return Object.entries(accountSummary)
      .filter(([cuenta]) => 
        cuenta.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort(([cuentaA], [cuentaB]) => cuentaA.localeCompare(cuentaB));
  }, [accountSummary, searchTerm]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Mayor de Cuentas (Formato T)
          </h2>
          <p className="text-gray-600">Resumen completo de movimientos por cuenta</p>
        </div>
        <Link 
          href="/" 
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          ← Volver al Libro Diario
        </Link>
      </div>

      {/* Filtro de búsqueda */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">🔍</span>
          </div>
          <input
            type="text"
            placeholder="Buscar cuenta..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {idmovimiento && (
            <button
              onClick={() => setHighlightedId(null)}
              className="absolute right-10 top-2 text-sm text-blue-600 hover:underline"
            >
              Limpiar filtro
            </button>
          )}
        </div>
        {searchTerm && (
          <p className="mt-2 text-sm text-gray-500">
            Mostrando {filteredAccounts.length} cuenta{filteredAccounts.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      <div className="space-y-6">
        {filteredAccounts.length > 0 ? (
          filteredAccounts.map(([cuenta, { debitos, creditos, saldo }]) => (
            <div 
              key={cuenta} 
              className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-3">
                <h3 className="font-bold text-xl text-white">{cuenta}</h3>
              </div>
              
              <div className="flex border-b">
                {/* Columna DEBE */}
                <div className="w-1/2 border-r">
                  <div className="bg-green-100 px-6 py-2 border-b">
                    <h4 className="font-semibold text-green-800 text-lg">DEBE</h4>
                  </div>
                  <div className="p-4 min-h-[200px]">
                    {debits
                      .filter(d => d.CUENTAD === cuenta)
                      .map((debit) => (
                        <div 
                          key={`${cuenta}-D-${debit.IDDEBE}`}
                          id={`idmovimiento-${debit.IDDEBE}`}
                          className={`mb-3 last:mb-0 p-2 hover:bg-green-50 rounded transition-colors ${
                            highlightedId === debit.IDDEBE ? 'bg-blue-50 border border-blue-200' : ''
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <Link
                              href={`/?idMovimiento=${debit.IDDEBE}`}
                              className="text-gray-500 text-sm hover:text-blue-600 hover:underline"
                            >
                              ID: {debit.IDDEBE}
                            </Link>
                            <p className="text-green-700 font-medium">
                              ${debit.CANTIDADD.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    
                    {debits.filter(d => d.CUENTAD === cuenta).length === 0 && (
                      <div className="flex justify-center items-center h-full py-4">
                        <p className="text-gray-400 italic">No hay movimientos</p>
                      </div>
                    )}
                    
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <p className="font-bold text-right text-green-800">
                        Total: ${debitos.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Columna HABER */}
                <div className="w-1/2">
                  <div className="bg-red-100 px-6 py-2 border-b">
                    <h4 className="font-semibold text-red-800 text-lg">HABER</h4>
                  </div>
                  <div className="p-4 min-h-[200px]">
                    {credits
                      .filter(h => h.CUENTAH === cuenta)
                      .map((credit) => (
                        <div 
                          key={`${cuenta}-H-${credit.IDHABER}`}
                          id={`cuenta-${credit.IDHABER}`}
                          className={`mb-3 last:mb-0 p-2 hover:bg-red-50 rounded transition-colors ${
                            highlightedId === credit.IDHABER ? 'bg-blue-50 border border-blue-200' : ''
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <Link
                              href={`/?idMovimiento=${credit.IDHABER}`}
                              className="text-gray-500 text-sm hover:text-blue-600 hover:underline"
                            >
                              ID: {credit.IDHABER}
                            </Link>
                            <p className="text-red-700 font-medium">
                              ${credit.CANTIDADH.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    
                    {credits.filter(h => h.CUENTAH === cuenta).length === 0 && (
                      <div className="flex justify-center items-center h-full py-4">
                        <p className="text-gray-400 italic">No hay movimientos</p>
                      </div>
                    )}
                    
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <p className="font-bold text-right text-red-800">
                        Total: ${creditos.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Saldo */}
              <div className={`px-6 py-3 ${
                saldo > 0 ? 'bg-green-100 text-green-800' : 
                saldo < 0 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              }`}>
                <p className="font-bold text-center text-lg">
                  SALDO: ${Math.abs(saldo).toLocaleString()} 
                  {saldo > 0 ? ' (Deudor)' : saldo < 0 ? ' (Acreedor)' : ' (Cero)'}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
            <span className="mx-auto text-4xl text-gray-400 mb-4">🔍</span>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              {searchTerm ? 'No se encontraron cuentas' : 'No hay cuentas disponibles'}
            </h3>
            <p className="text-gray-500">
              {searchTerm ? 'Intenta con otro término de búsqueda' : 'No hay datos para mostrar'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}