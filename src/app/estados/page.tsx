"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function EstadosFinancieros() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("patrimonial");

  // Datos de ejemplo (reemplazar con tus datos reales)
  const [estadoPatrimonial, setEstadoPatrimonial] = useState({
    activo: {
      corriente: 3541000,
      noCorriente: 42000000,
      total: 45541000
    },
    pasivo: {
      corriente: 23000000,
      noCorriente: 0,
      total: 23000000
    },
    patrimonio: {
      capital: 22541000,
      reservas: 0,
      total: 22541000
    }
  });

  const [estadoResultados, setEstadoResultados] = useState({
    ingresos: 500000,
    costos: 300000,
    utilidadBruta: 300000,
    gastos: 100000,
    utilidadOperativa: 100000,
    impuestos: 30000,
    utilidadNeta: 70000
  });

  const [flujoEfectivo, setFlujoEfectivo] = useState({
    operacion: 90000,
    inversion: -50000,
    financiamiento: -20000,
    neto: 20000,
    saldoInicial: 50000,
    saldoFinal: 70000
  });

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-6 py-1">
            <div className="h-8 bg-gray-300 rounded w-3/4"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-6 bg-gray-300 rounded col-span-2"></div>
                <div className="h-6 bg-gray-300 rounded col-span-1"></div>
              </div>
              <div className="h-6 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Estados Financieros</h1>
            <Link 
                      href="/" 
                      className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      ← Volver al Libro Diario
                    </Link>
        </div>
      
      
      {/* Pestañas de navegación */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button 
          onClick={() => setActiveTab("patrimonial")}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === "patrimonial" 
              ? "bg-blue-600 text-white shadow-md" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Situación Patrimonial
        </button>
        <button 
          onClick={() => setActiveTab("resultados")}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === "resultados" 
              ? "bg-blue-600 text-white shadow-md" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Estado de Resultados
        </button>
        <button 
          onClick={() => setActiveTab("efectivo")}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === "efectivo" 
              ? "bg-blue-600 text-white shadow-md" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Flujo de Efectivo
        </button>
      </div>

      {/* Estado de Situación Patrimonial */}
      {activeTab === "patrimonial" && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Estado de Situación Patrimonial</h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Al 31/12/2023</span>
            </div>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Activo */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-lg mb-4 text-blue-700">ACTIVO</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-700">Activo Corriente</span>
                    <span className="font-medium">${estadoPatrimonial.activo.corriente.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-700">Activo No Corriente</span>
                    <span className="font-medium">${estadoPatrimonial.activo.noCorriente.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-3 font-bold mt-4 bg-blue-50 px-2 rounded">
                    <span className="text-blue-700">TOTAL ACTIVO</span>
                    <span className="text-blue-700">${estadoPatrimonial.activo.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Pasivo y Patrimonio */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-lg mb-4 text-blue-700">PASIVO Y PATRIMONIO</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-700">Pasivo Corriente</span>
                    <span className="font-medium">${estadoPatrimonial.pasivo.corriente.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-700">Pasivo No Corriente</span>
                    <span className="font-medium">${estadoPatrimonial.pasivo.noCorriente.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-700">Capital</span>
                    <span className="font-medium">${estadoPatrimonial.patrimonio.capital.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-700">Reservas</span>
                    <span className="font-medium">${estadoPatrimonial.patrimonio.reservas.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-3 font-bold mt-4 bg-blue-50 px-2 rounded">
                    <span className="text-blue-700">TOTAL PASIVO Y PATRIMONIO</span>
                    <span className="text-blue-700">${(estadoPatrimonial.pasivo.total + estadoPatrimonial.patrimonio.total).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gray-50 text-center">
            <p className="text-sm text-gray-500">* Valores expresados en pesos argentinos</p>
          </div>
        </div>
      )}

      {/* Estado de Resultados */}
      {activeTab === "resultados" && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Estado de Resultados</h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Ejercicio 2025</span>
            </div>
          </div>
          <div className="p-6">
            <div className="max-w-2xl mx-auto">
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-700">Ingresos</span>
                  <span className="font-medium">${estadoResultados.ingresos.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-700">Costos</span>
                  <span className="font-medium text-red-600">(${estadoResultados.costos.toLocaleString()})</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100 font-bold bg-blue-50 px-2 rounded">
                  <span className="text-blue-700">Utilidad Bruta</span>
                  <span className="text-blue-700">${estadoResultados.utilidadBruta.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-700">Gastos Operativos</span>
                  <span className="font-medium text-red-600">(${estadoResultados.gastos.toLocaleString()})</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100 font-bold bg-blue-50 px-2 rounded">
                  <span className="text-blue-700">Utilidad Operativa</span>
                  <span className="text-blue-700">${estadoResultados.utilidadOperativa.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-700">Impuestos</span>
                  <span className="font-medium text-red-600">(${estadoResultados.impuestos.toLocaleString()})</span>
                </div>
                <div className="flex justify-between py-4 font-bold text-lg bg-green-50 px-3 rounded-lg mt-4">
                  <span className="text-green-700">UTILIDAD NETA DEL EJERCICIO</span>
                  <span className="text-green-700">${estadoResultados.utilidadNeta.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gray-50 text-center">
            <p className="text-sm text-gray-500">* Valores expresados en pesos argentinos</p>
          </div>
        </div>
      )}

      {/* Flujo de Efectivo */}
      {activeTab === "efectivo" && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Estado de Flujo de Efectivo</h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Ejercicio 2023</span>
            </div>
          </div>
          <div className="p-6">
            <div className="max-w-2xl mx-auto">
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-700">Flujo de actividades operativas</span>
                  <span className={`font-medium ${flujoEfectivo.operacion >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${flujoEfectivo.operacion.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-700">Flujo de actividades de inversión</span>
                  <span className={`font-medium ${flujoEfectivo.inversion >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${flujoEfectivo.inversion.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-700">Flujo de actividades de financiamiento</span>
                  <span className={`font-medium ${flujoEfectivo.financiamiento >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${flujoEfectivo.financiamiento.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100 font-bold bg-blue-50 px-2 rounded">
                  <span className="text-blue-700">Flujo neto del período</span>
                  <span className={`${flujoEfectivo.neto >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${flujoEfectivo.neto.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-700">Saldo inicial de efectivo</span>
                  <span className="font-medium">${flujoEfectivo.saldoInicial.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-4 font-bold text-lg bg-green-50 px-3 rounded-lg mt-4">
                  <span className="text-green-700">SALDO FINAL DE EFECTIVO</span>
                  <span className="text-green-700">${flujoEfectivo.saldoFinal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gray-50 text-center">
            <p className="text-sm text-gray-500">* Valores expresados en pesos argentinos</p>
          </div>
        </div>
      )}
    </div>
  );
}