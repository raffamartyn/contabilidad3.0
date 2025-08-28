"use client";

import React, { useEffect, useState, Suspense } from "react";
import api from "@/api";
import apid from "@/apid";
import apih from "@/apih";
import type { Data, Datad, Datah } from "@/type";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// 🔹 Componente que usa useSearchParams
function LibroDiarioContent() {
  const [transactions, setTransactions] = useState<Data[]>([]);
  const [debits, setDebits] = useState<Datad[]>([]);
  const [credits, setCredits] = useState<Datah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // Estados para el filtro de fecha
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Obtener parámetros de búsqueda
  const searchParams = useSearchParams();
  const idMovimiento = searchParams.get("idMovimiento");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [generalData, debitData, creditData] = await Promise.all([
          api.match.list(),
          apid.match.list(),
          apih.match.list(),
        ]);

        setTransactions(generalData);
        setDebits(debitData);
        setCredits(creditData);

        // Si hay un ID en los parámetros, resaltarlo
        if (idMovimiento) {
          setHighlightedId(idMovimiento);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idMovimiento]);

  // Efecto para scroll automático al elemento destacado
  useEffect(() => {
    if (highlightedId) {
      setTimeout(() => {
        const element = document.getElementById(`movimiento-${highlightedId}`);
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 500);
    }
  }, [highlightedId, transactions]);

  // Filtrar transacciones por rango de fecha
  const filteredTransactions = transactions.filter((tx) => {
    if (!startDate || !endDate) return true;

    // Convertir "DD/MM/YYYY" a "YYYY-MM-DD"
    const [day, month, year] = tx.FECHA.split("/").map(Number);
    const formattedDate = new Date(year, month - 1, day)
      .toISOString()
      .split("T")[0];

    return formattedDate >= startDate && formattedDate <= endDate;
  });

  if (loading) return <p className="text-center text-gray-600">Cargando datos...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">📖 Libro Diario Contable</h2>
        <div className="flex gap-4">
          <Link
            href="sumasysaldo"
            className="text-blue-600 hover:underline flex items-center"
          >
            Ver Sumas y Saldos →
          </Link>
          <Link
            href="estados"
            className="text-blue-600 hover:underline flex items-center"
          >
            Estados Financieros →
          </Link>
        </div>
      </div>

      {/* Filtro por fecha */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold mb-3">🔎 Filtros</h3>
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha inicial
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 border rounded shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha final
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 border rounded shadow-sm"
            />
          </div>
          {(startDate || endDate) && (
            <button
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
              className="self-end text-sm text-blue-600 hover:underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-500">No se encontraron transacciones</p>
          {(startDate || endDate) && (
            <button
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
              className="mt-2 text-blue-600 hover:underline"
            >
              Mostrar todas las transacciones
            </button>
          )}
        </div>
      ) : (
        filteredTransactions.map((tx) => {
          const relatedDebits = debits.filter((d) => d.IDDEBE === tx.id);
          const relatedCredits = credits.filter((h) => h.IDHABER === tx.id);

          const totalDebe = relatedDebits.reduce(
            (sum, d) => sum + d.CANTIDADD,
            0
          );
          const totalHaber = relatedCredits.reduce(
            (sum, h) => sum + h.CANTIDADH,
            0
          );

          return (
            <div
              id={`movimiento-${tx.id}`}
              key={tx.id}
              className={`bg-white shadow-md rounded-lg p-4 mb-6 border-2 transition-all duration-300 ${
                highlightedId === tx.id
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold">
                    Transacción #{tx.numero}
                  </h3>
                  <p className="text-gray-500">
                    <span className="font-medium">Fecha:</span> {tx.FECHA}
                  </p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  ID: {tx.id}
                </span>
              </div>

              <p className="text-gray-700 mb-4">
                <span className="font-medium">Descripción:</span>{" "}
                {tx.descripcion}
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 text-sm">
                      <th className="border p-2 text-left">ID Movimiento</th>
                      <th className="border p-2 text-left">Cuenta</th>
                      <th className="border p-2 text-right">Debe</th>
                      <th className="border p-2 text-right">Haber</th>
                    </tr>
                  </thead>
                  <tbody>
                    {relatedDebits.map((debit) => (
                      <tr
                        key={`${tx.id}-D-${debit.IDDEBE}`}
                        className="hover:bg-green-50"
                      >
                        <td className="border p-2 text-sm text-gray-600">
                          {debit.IDDEBE}
                        </td>
                        <td className="border p-2">{debit.CUENTAD}</td>
                        <td className="border p-2 text-right text-green-600 font-medium">
                          ${debit.CANTIDADD.toLocaleString()}
                        </td>
                        <td className="border p-2 text-right">-</td>
                      </tr>
                    ))}

                    {relatedCredits.map((credit) => (
                      <tr
                        key={`${tx.id}-H-${credit.IDHABER}`}
                        className="hover:bg-red-50"
                      >
                        <td className="border p-2 text-sm text-gray-600">
                          {credit.IDHABER}
                        </td>
                        <td className="border p-2">{credit.CUENTAH}</td>
                        <td className="border p-2 text-right">-</td>
                        <td className="border p-2 text-right text-red-600 font-medium">
                          ${credit.CANTIDADH.toLocaleString()}
                        </td>
                      </tr>
                    ))}

                    {relatedDebits.length === 0 &&
                      relatedCredits.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="border p-2 text-center text-gray-500"
                          >
                            No hay movimientos registrados
                          </td>
                        </tr>
                      )}

                    {/* Totales */}
                    <tr className="bg-gray-50 font-bold">
                      <td colSpan={2} className="border p-2 text-right">
                        TOTAL:
                      </td>
                      <td className="border p-2 text-right text-green-700">
                        ${totalDebe.toLocaleString()}
                      </td>
                      <td className="border p-2 text-right text-red-700">
                        ${totalHaber.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Balance Final */}
              <div
                className={`mt-3 text-center font-bold p-2 rounded ${
                  totalDebe === totalHaber
                    ? "text-green-800 bg-green-100"
                    : "text-red-800 bg-red-100"
                }`}
              >
                {totalDebe === totalHaber
                  ? "✅ TRANSACCIÓN BALANCEADA"
                  : `⚠ DESBALANCE DETECTADO (Diferencia: $${Math.abs(
                      totalDebe - totalHaber
                    ).toLocaleString()})`}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

// 🔹 Export con Suspense para proteger useSearchParams
export default function LibroDiario() {
  return (
    <Suspense fallback={<p className="text-center text-gray-600">Cargando...</p>}>
      <LibroDiarioContent />
    </Suspense>
  );
}
