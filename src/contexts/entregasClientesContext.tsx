"use client";

import { clientesTipo } from "@/types/clientesType";
import { entregasTipo } from "@/types/entregasTypes";
import { createContext, useContext, useEffect, useState } from "react";
import { contextAutenticacao } from "./contextoUsuario";
import getSocket from "@/socket/socketCliente";

interface EntregasContextProps {
  todosClientes: clientesTipo[] | undefined;

  entregasDia: entregasTipo[] | undefined;
  entregasAndamento: entregasTipo[] | undefined;
  entregasConcluidas: entregasTipo[] | undefined;
  entregasRelatorio: entregasTipo[] | undefined;

  rotaEntregasMarcos: entregasTipo[] | undefined;
  rotaEntregasUene: entregasTipo[] | undefined;
  rotaEntregasLeo: entregasTipo[] | undefined;
  rotaEntregasJoao: entregasTipo[] | undefined;
  rotasEntregasMotoristas: (
    nomeMotorista: string,
    conjuntoEntregas: entregasTipo[]
  ) => void;

  atualizandoEntregas: () => void;
  atualizandoEntregasRelatorio: () => void;
  atualizandoClientes: () => void;

  filtrosRelatorio: {
    dataInicio: string;
    dataFim: string;
    motorista: string;
    valorMinimo: string;
    valorMaximo: string;
  };
  setFiltrosRelatorio: React.Dispatch<
    React.SetStateAction<{
      dataInicio: string;
      dataFim: string;
      motorista: string;
      valorMinimo: string;
      valorMaximo: string;
    }>
  >;
}

export const ContextEntregasClientes = createContext<EntregasContextProps>(
  {} as any
);

export function EntregasClientesProvedor({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /**Defininindo os states que poderão ser posteriormente acessados */
  const { usuarioLogado } = useContext(contextAutenticacao);
  const [entregasDia, setEntregasDia] = useState<entregasTipo[]>();
  const [entregasAndamento, setEntregasAndamento] = useState<entregasTipo[]>();
  const [entregasConcluidas, setEntregasConcluidas] =
    useState<entregasTipo[]>();
  const [todosClientes, setTodosClientes] = useState<clientesTipo[]>();
  const [entregasRelatorio, setEntregasRelatorio] = useState<entregasTipo[]>();

  const [rotaEntregasMarcos, setRotaEntregaMarcos] = useState<entregasTipo[]>();
  const [rotaEntregasUene, setRotaEntregaUene] = useState<entregasTipo[]>();
  const [rotaEntregasLeo, setRotaEntregaLeo] = useState<entregasTipo[]>();
  const [rotaEntregasJoao, setRotaEntregaJoao] = useState<entregasTipo[]>();

  const [filtrosRelatorio, setFiltrosRelatorio] = useState({
    dataInicio: "",
    dataFim: "",
    motorista: "todos",
    valorMinimo: "",
    valorMaximo: "",
  });

  const socket = getSocket();

  const atualizandoEntregas = () => {
    socket.emit("Buscar Entregas");
  };

  const atualizandoEntregasEffect = (entregasRecebidas: entregasTipo[]) => {
    if (!entregasRecebidas) return;

    const todasEntregas: entregasTipo[] = entregasRecebidas;

    // Formatando a data atual para o mesmo padrão [dia/mes/ano]
    const hoje = new Date();
    const dataAtual = [
      hoje.getDate(),
      hoje.getMonth() + 1,
      hoje.getFullYear(),
    ].join("/");

    // Filtrando entregas por status
    const dataEntregasDisponiveis = todasEntregas.filter(
      (entrega) => entrega.status === "Disponível"
    );
    const dataEntregasAndamento = todasEntregas.filter(
      (entrega) => entrega.status === "Andamento"
    );
    const dataEntregasConcluidas = todasEntregas.filter(
      (entrega) => entrega.status === "Concluída"
    );

    // Filtrando rotas por motorista
    const rotaMarcos = dataEntregasDisponiveis.filter(
      (entrega) =>
        entrega.entregador === "Marcos" && entrega.dia.join("/") === dataAtual
    );

    const rotaUene = dataEntregasDisponiveis.filter(
      (entrega) =>
        entrega.entregador === "Uene" && entrega.dia.join("/") === dataAtual
    );

    const rotaLeo = dataEntregasDisponiveis.filter(
      (entrega) =>
        entrega.entregador === "Leo" && entrega.dia.join("/") === dataAtual
    );

    const rotaJoao = dataEntregasDisponiveis.filter(
      (entrega) =>
        entrega.entregador === "João" && entrega.dia.join("/") === dataAtual
    );

    // Atualizando os estados
    setEntregasDia(dataEntregasDisponiveis);
    setEntregasAndamento(dataEntregasAndamento);
    setEntregasConcluidas(dataEntregasConcluidas);

    setRotaEntregaMarcos(rotaMarcos);
    setRotaEntregaUene(rotaUene);
    setRotaEntregaLeo(rotaLeo);
    setRotaEntregaJoao(rotaJoao);
  };

  const atualizandoClientes = () => {
    socket.emit("Buscar Clientes");
  };

  const rotasEntregasMotoristas = (
    nomeMotorista: string,
    conjuntoEntregas: entregasTipo[]
  ) => {
    if (nomeMotorista === "Marcos") {
      setRotaEntregaMarcos(conjuntoEntregas);
    } else if (nomeMotorista === "Uene") {
      setRotaEntregaUene(conjuntoEntregas);
    } else if (nomeMotorista === "Leo") {
      setRotaEntregaLeo(conjuntoEntregas);
    } else if (nomeMotorista === "João") {
      setRotaEntregaJoao(conjuntoEntregas);
    }
  };

  const atualizandoEntregasRelatorio = () => {
    socket.emit("Buscar Entregas Relatorio");
  };

  useEffect(() => {
    socket.on("Atualizando entregas", (entregasDoDia: entregasTipo[]) => {
      atualizandoEntregasEffect(entregasDoDia);
    });

    socket.on("Atualizando clientes", (clientes: clientesTipo[]) => {
      setTodosClientes(clientes);
    });

    socket.on("Atualizando entregas relatorio", (entregas: entregasTipo[]) => {
      setEntregasRelatorio(entregas);
    });

    return () => {
      socket.off("Atualizando entregas");
      socket.off("Atualizando clientes");
      socket.off("Atualizando entregas relatorio");
    };
  }, []);

  return (
    <ContextEntregasClientes.Provider
      value={{
        entregasDia,
        entregasRelatorio,
        entregasAndamento,
        entregasConcluidas,
        atualizandoEntregas,
        atualizandoEntregasRelatorio,
        todosClientes,
        atualizandoClientes,
        rotasEntregasMotoristas,
        rotaEntregasMarcos,
        rotaEntregasUene,
        rotaEntregasLeo,
        rotaEntregasJoao,
        filtrosRelatorio,
        setFiltrosRelatorio,
      }}
    >
      {children}
    </ContextEntregasClientes.Provider>
  );
}
