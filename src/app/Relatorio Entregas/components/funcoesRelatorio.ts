import { entregasTipo } from "@/types/entregasTypes";

export function valorConjuntoEntrega(conjuntoEntregas: entregasTipo[]): number {
  return conjuntoEntregas.reduce((total, entrega) => {
    const valor = converterParaNumero(entrega.valor);
    return total + valor;
  }, 0);
}

export function converterParaNumero(valor: string): number {
  try {
    const numeroLimpo = valor.replace(/[^\d,]/g, "").replace(",", ".");
    const numero = parseFloat(numeroLimpo);
    return isNaN(numero) ? 0 : numero;
  } catch {
    return 0;
  }
}

export function calcularEstatisticasPeriodo(
  entregas: entregasTipo[],
  dataInicio: Date,
  dataFim: Date
) {
  const entregasFiltradas = entregas.filter((entrega) => {
    const dataEntrega = new Date(
      entrega.dia[2],
      entrega.dia[1] - 1,
      entrega.dia[0]
    );
    return dataEntrega >= dataInicio && dataEntrega <= dataFim;
  });

  return {
    totalEntregas: entregasFiltradas.length,
    valorTotal: valorConjuntoEntrega(entregasFiltradas),
    entregasPorMotorista: contarEntregasPorMotorista(entregasFiltradas),
  };
}

function contarEntregasPorMotorista(entregas: entregasTipo[]) {
  return entregas.reduce((acc, entrega) => {
    const motorista = entrega.entregador;
    acc[motorista] = (acc[motorista] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}
