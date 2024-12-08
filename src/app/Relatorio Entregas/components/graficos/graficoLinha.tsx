import React, { useContext, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController,
} from "chart.js";
import { entregasTipo } from "@/types/entregasTypes";
import { ContextEntregasClientes } from "@/contexts/entregasClientesContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController
);

const valorTotalEntregas = (entregas: entregasTipo[]) => {
  let valorTotalFaturado = 0;
  for (let i = 0; i < entregas.length; i++) {
    valorTotalFaturado += Number(entregas[i].valor.replace(",", "."));
  }
  console.log(valorTotalFaturado);
  return valorTotalFaturado;
};

const LineChart: React.FC = () => {
  const { entregasRelatorio } = useContext(ContextEntregasClientes);
  const hoje = new Date();
  const diaHoje = [hoje.getDate(), hoje.getMonth() + 1, hoje.getFullYear()];

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "white",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            if (context.datasetIndex === 0) {
              const value = context.raw;
              return `Valor: ${value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}`;
            } else {
              return `Quantidade: ${context.raw} entregas`;
            }
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "white" },
      },
      y: {
        ticks: { color: "white" },
      },
    },
  };

  const calcularValoresUltimos7Dias = (entregasRelatorio: entregasTipo[]) => {
    const hoje = new Date();
    const diaHoje = [hoje.getDate(), hoje.getMonth() + 1, hoje.getFullYear()];

    const decrementarDia = (data: number[]): number[] => {
      let [dia, mes, ano] = data;
      dia -= 1;
      if (dia === 0) {
        mes -= 1;
        if (mes === 0) {
          mes = 12;
          ano -= 1;
        }
        dia = new Date(ano, mes, 0).getDate(); // Último dia do mês anterior
      }
      return [dia, mes, ano];
    };

    const valoresUltimos7Dias = [];
    let dataAtual = diaHoje;

    for (let i = 0; i < 7; i++) {
      const entregasDoDia = entregasRelatorio.filter((entrega) => {
        const [dia, mes, ano] = entrega.dia;
        return (
          dia === dataAtual[0] && mes === dataAtual[1] && ano === dataAtual[2]
        );
      });

      const valorTotal = valorTotalEntregas(entregasDoDia);
      valoresUltimos7Dias.unshift(valorTotal); // Adiciona no início do array

      dataAtual = decrementarDia(dataAtual);
    }

    return valoresUltimos7Dias;
  };

  const contarEntregasUltimos7Dias = (entregasRelatorio: entregasTipo[]) => {
    const hoje = new Date();
    const diaHoje = [hoje.getDate(), hoje.getMonth() + 1, hoje.getFullYear()];

    const decrementarDia = (data: number[]): number[] => {
      let [dia, mes, ano] = data;
      dia -= 1;
      if (dia === 0) {
        mes -= 1;
        if (mes === 0) {
          mes = 12;
          ano -= 1;
        }
        dia = new Date(ano, mes, 0).getDate(); // Último dia do mês anterior
      }
      return [dia, mes, ano];
    };

    const contagemUltimos7Dias = [];
    let dataAtual = diaHoje;

    for (let i = 0; i < 7; i++) {
      const entregasDoDia = entregasRelatorio.filter((entrega) => {
        const [dia, mes, ano] = entrega.dia;
        return (
          dia === dataAtual[0] && mes === dataAtual[1] && ano === dataAtual[2]
        );
      });

      const contagem = entregasDoDia.length;
      contagemUltimos7Dias.unshift(contagem); // Adiciona no início do array

      dataAtual = decrementarDia(dataAtual);
    }

    return contagemUltimos7Dias;
  };

  // Exemplo de uso
  const contagem = entregasRelatorio
    ? contarEntregasUltimos7Dias(entregasRelatorio)
    : 0;
  console.log(contagem);

  // Exemplo de uso
  const valores = entregasRelatorio
    ? calcularValoresUltimos7Dias(entregasRelatorio)
    : 0;
  console.log(valores);

  const data = {
    labels: [
      "Há 7 dias",
      "Há 6 dias",
      "Há 5 dias",
      "Há 4 dias",
      "Há 3 dias",
      "Há 2 dias",
      "Hoje",
    ],
    datasets: [
      {
        label: "Valor Total (R$)",
        data: valores,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Quantidade de Entregas",
        data: contagem,
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div
      className="chart-container"
      style={{ width: "350px", height: "350px" }}
    >
      <Line
        data={data}
        options={{
          ...options,
          maintainAspectRatio: false,
          responsive: true,
        }}
      />
    </div>
  );
};

export default LineChart;
