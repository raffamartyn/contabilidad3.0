"use client";

import React, { useEffect, useState } from "react";
import api from "@/api";
import apid from "@/apid";
import apih from "@/apih";
import type { Data, Datad, Datah } from "@/type";
import Link from "next/link";

export default function LibroDiario() {
  const [transactions, setTransactions] = useState<Data[]>([]);
  const [debits, setDebits] = useState<Datad[]>([]);
  const [credits, setCredits] = useState<Datah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para el filtro de fecha
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center text-gray-600">Cargando datos...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  // Filtrar transacciones por rango de fecha
  const filteredTransactions = transactions.filter((tx) => {
    if (!startDate || !endDate) return true; // Si no hay fechas, mostrar todo

    // Convertir "DD/MM/YYYY" a "YYYY-MM-DD"
    const [day, month, year] = tx.FECHA.split("/").map(Number);
    const formattedDate = new Date(year, month - 1, day).toISOString().split("T")[0];

    return formattedDate >= startDate && formattedDate <= endDate;
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">📖 Libro Diario Contablesa</h2>
      <Link href="sumasysaldo" className="text-blue-600 hover:underline">
        Ver Resumen de Cuentas →
      </Link>

      {/* 🔎 Filtro por fecha */}
      <div className="flex justify-center gap-4 mb-6">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      {filteredTransactions.map((tx) => {
        const relatedDebits = debits.filter((d) => d.IDDEBE === tx.id);
        const relatedCredits = credits.filter((h) => h.IDHABER === tx.id);

        // Calcular totales de Debe y Haber
        const totalDebe = relatedDebits.reduce((sum, d) => sum + d.CANTIDADD, 0);
        const totalHaber = relatedCredits.reduce((sum, h) => sum + h.CANTIDADH, 0);

        return (
          <div key={tx.id} className="bg-white shadow-md rounded-lg p-4 mb-6 border border-gray-200">
            <h3 className="text-lg font-semibold">Hecho Económico #{tx.numero}</h3>
            <p className="text-gray-500"><strong>Fecha:</strong> {tx.FECHA}</p>
            <p className="text-gray-700"><strong>Descripción:</strong> {tx.descripcion}</p>

            <table className="w-full mt-4 border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="border p-2">Cuenta</th>
                  <th className="border p-2">Tipo</th>
                  <th className="border p-2">Resultado</th>
                  <th className="border p-2">Debe</th>
                  <th className="border p-2">Haber</th>
                </tr>
              </thead>
              <tbody>
                {relatedDebits.map((debit, index) => (
                  <tr key={`${tx.id}-D${index}`} className="bg-green-50">
                    <td className="border p-2">{debit.CUENTAD}</td>
                    <td className="border p-2">{debit.TIPOD}</td>
                    <td className="border p-2">{debit.RESULTADOD}</td>
                    <td className="border p-2 text-green-600 font-semibold">{debit.CANTIDADD ? `$${debit.CANTIDADD.toLocaleString()}` : "-"}</td>
                    <td className="border p-2">-</td>
                  </tr>
                ))}

                {relatedCredits.map((credit, index) => (
                  <tr key={`${tx.id}-H${index}`} className="bg-red-50">
                    <td className="border p-2">{credit.CUENTAH}</td>
                    <td className="border p-2">{credit.TIPOH}</td>
                    <td className="border p-2">{credit.RESULTADOH}</td>
                    <td className="border p-2">-</td>
                    <td className="border p-2 text-red-600 font-semibold">{credit.CANTIDADH ? `$${credit.CANTIDADH.toLocaleString()}` : "-"}</td>
                  </tr>
                ))}

                {relatedDebits.length === 0 && relatedCredits.length === 0 && (
                  <tr>
                    <td colSpan={5} className="border p-2 text-center text-gray-500">No hay movimientos registrados</td>
                  </tr>
                )}

                {/* Totales */}
                <tr className="bg-gray-200 font-bold">
                  <td className="border p-2 text-right" colSpan={3}>TOTAL:</td>
                  <td className="border p-2 text-green-700">${totalDebe.toLocaleString()}</td>
                  <td className="border p-2 text-red-700">${totalHaber.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            {/* Balance Final */}
            <p className={`mt-3 text-center font-bold p-2 rounded ${totalDebe === totalHaber ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"}`}>
              {totalDebe === totalHaber ? "✅ Balanceado" : "⚠ Desbalanceado"}
            </p>
          </div>
        );
      })}
    </div>
  );
}
