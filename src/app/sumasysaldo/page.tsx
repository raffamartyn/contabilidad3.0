"use client";

import React, { useEffect, useState, useMemo, Suspense } from "react";
import apid from "@/apid";
import apih from "@/apih";
import type { Datad, Datah } from "@/type";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ResumenCuentasContent() {
  const [debits, setDebits] = useState<Datad[]>([]);
  const [credits, setCredits] = useState<Datah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [accountSummary, setAccountSummary] = useState<{
    [key: string]: { debitos: number; creditos: number; saldo: number };
  }>({});

  // ✅ Ahora sí está dentro de Suspense
  const searchParams = useSearchParams();
  const idmovimiento = searchParams.get("cuenta");

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

  useEffect(() => {
    if (highlightedId) {
      setTimeout(() => {
        const element = document.getElementById(`cuenta-${highlightedId}`);
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* 🔽 ... aquí sigue todo tu JSX igual, no hace falta cambiar más */}
      {/* yo solo moví useSearchParams dentro de este subcomponente */}
    </div>
  );
}

export default function ResumenCuentasT() {
  return (
    <Suspense fallback={<div className="p-6">Cargando resumen...</div>}>
      <ResumenCuentasContent />
    </Suspense>
  );
}
