import React, { useContext } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { entregasTipo } from "@/types/entregasTypes";
import { ContextEntregasClientes } from "@/contexts/entregasClientesContext";

ChartJS.register(ArcElement, Tooltip, Legend);

const definirDadosGrafico = (mes: number, semana: number, dia: number) => {
  const data = {
    labels: [
      "Faturamento do Mês",
      "Faturamento da Semana",
      "Faturamento do Dia",
    ],
    datasets: [
      {
        data: [mes, semana, dia],
        backgroundColor: ["#001D4A", "rgb(144, 70, 207)", "rgb(12, 206, 107)"],
        hoverOffset: 4,
      },
    ],
  };
  return data;
};

const data = {
  labels: ["Mês", "Semana", "Dia"],
  datasets: [
    {
      label: "My First Dataset",
      data: [300, 50, 100],
      backgroundColor: ["#001D4A", "rgb(144, 70, 207)", "rgb(12, 206, 107)"],
      hoverOffset: 4,
    },
  ],
};

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
          const value = context.raw;
          const formattedValue = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          });
          return `${context.label}: ${formattedValue}`;
        },
      },
    },
  },
};

const DoughnutChart: React.FC = () => {
  const { entregasRelatorio } = useContext(ContextEntregasClientes);

  const hoje = new Date();
  const diaHoje = [hoje.getDate(), hoje.getMonth() + 1, hoje.getFullYear()];

  const entregasDoMes = entregasRelatorio?.filter((entrega) => {
    if (
      (entrega.dia[1] == diaHoje[1] || entrega.dia[1] == diaHoje[1] - 1) &&
      entrega.dia[0] != diaHoje[0]
    ) {
      return entrega;
    }
  });

  const entregasDaSemana = entregasRelatorio?.filter((entrega) => {
    if (
      (entrega.dia[0] == diaHoje[0] - 1 ||
        entrega.dia[0] == diaHoje[0] - 2 ||
        entrega.dia[0] == diaHoje[0] - 3 ||
        entrega.dia[0] == diaHoje[0] - 4 ||
        entrega.dia[0] == diaHoje[0] - 5 ||
        entrega.dia[0] == diaHoje[0] - 6 ||
        entrega.dia[0] == diaHoje[0] - 7) &&
      entrega.dia[1] === diaHoje[1]
    ) {
      return entrega;
    }
  });

  const entregasDoDia = entregasRelatorio?.filter((entrega) => {
    if (entrega.status === "Concluída") {
      if (entrega.dia[0] === diaHoje[0] && entrega.dia[1] === diaHoje[1]) {
        return entrega;
      }
    }
  });

  const valorTotalEntregas = (entregas: entregasTipo[]) => {
    let valorTotalFaturado = 0;
    for (let i = 0; i < entregas.length; i++) {
      valorTotalFaturado += Number(entregas[i].valor.replace(",", "."));
    }
    console.log(valorTotalFaturado);
    return valorTotalFaturado;
  };

  const entregasDoMesTotal = entregasDoMes
    ? valorTotalEntregas(entregasDoMes)
    : 0;
  const entregasDaSemanaTotal = entregasDaSemana
    ? valorTotalEntregas(entregasDaSemana)
    : 0;
  const entregasDoDiaTotal = entregasDoDia
    ? valorTotalEntregas(entregasDoDia)
    : 0;

  return (
    <div
      className="chart-container2"
      style={{ width: "350px", height: "350px" }}
    >
      <Doughnut
        data={definirDadosGrafico(
          entregasDoMesTotal,
          entregasDaSemanaTotal,
          entregasDoDiaTotal
        )}
        options={{
          ...options,
          maintainAspectRatio: false,
          responsive: true,
        }}
      />
    </div>
  );
};

export default DoughnutChart;
