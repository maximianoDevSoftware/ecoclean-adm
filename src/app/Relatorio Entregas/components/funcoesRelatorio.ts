import { entregasTipo } from "@/types/entregasTypes";

export function valorConjuntoEntrega(conjuntoEntregas: entregasTipo[]): number {
  let valorTotal: number = 0; // Inicializa valorTotal com 0

  conjuntoEntregas.forEach((entrega) => {
    valorTotal += converterParaNumero(entrega.valor);
  });

  return valorTotal; // Retorna valorTotal
}

function converterParaNumero(valor: string): number {
  try {
    // Tenta converter a string para float
    const numero = parseFloat(valor.replace(",", "."));
    // Verifica se a conversão foi bem-sucedida
    if (isNaN(numero)) {
      throw new Error("Não é um número");
    }
    // Retorna o número convertido
    return numero;
  } catch (error) {
    // Se não for possível converter, retorna 0
    return 0;
  }
}
