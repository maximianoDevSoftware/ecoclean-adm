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
  Legend
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
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "white", // Cor do texto da legenda
        },
      },
      tooltip: {
        titleColor: "white", // Cor do texto do título do tooltip
        bodyColor: "white", // Cor do texto do corpo do tooltip
        footerColor: "white", // Cor do texto do rodapé do tooltip
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white", // Cor dos textos do eixo X
        },
      },
      y: {
        ticks: {
          color: "white", // Cor dos textos do eixo Y
        },
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
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
      "Domingo",
    ],
    datasets: [
      {
        label: "My First Dataset",
        data: valores,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "My Second Dataset",
        data: contagem,
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="chart-container">
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
