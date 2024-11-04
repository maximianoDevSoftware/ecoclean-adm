"use client";
import { ProvedorAutenticacao } from "@/contexts/contextoUsuario";
import { EntregasClientesProvedor } from "@/contexts/entregasClientesContext";
import { SideBar } from "./sideBar/sideBar";
import dynamic from "next/dynamic";
import ClientesEntregas from "./telasFull/clientesEntrega";
import NovoClienteEntregas from "./telasFull/novoClienteEntrega";
import { TelaFullRelatEntregas } from "./Relatorio Entregas/telaRelEntregas";
import { FaMapMarkedAlt, FaPeopleCarry, FaUsers } from "react-icons/fa";

const Mapa = dynamic(() => import("./mapa/meuMapa"), { ssr: false });
const MotoraLogin = dynamic(() => import("./usuariosLogados/motoristaLogin"), {
  ssr: false,
});
const TelaMarcadorInform = dynamic(
  () => import("./informsMarcador/informsMarcador"),
  { ssr: false }
);

export default function Home() {
  const trocandoTela = (tela: string) => {
    const mapa = document.getElementById("meuMapaId");
    const sideBar = document.getElementById("sideBarId");
    const telaMotoristas = document.getElementById("telaMotoristas");

    // Primeiro reseta todos para z-index base
    if (mapa) mapa.style.zIndex = "5";
    if (sideBar) sideBar.style.zIndex = "5";
    if (telaMotoristas) telaMotoristas.style.zIndex = "5";

    // Depois aplica o z-index maior para o elemento selecionado
    switch (tela) {
      case "mapa":
        if (mapa) mapa.style.zIndex = "15";
        break;
      case "sidebar":
        if (sideBar) sideBar.style.zIndex = "15";
        break;
      case "login":
        if (telaMotoristas) telaMotoristas.style.zIndex = "15";
        break;
    }
  };

  return (
    <main className="corpoProjeto">
      <ProvedorAutenticacao>
        <EntregasClientesProvedor>
          <Mapa>
            <SideBar />
            <ClientesEntregas />
            <NovoClienteEntregas />
            <MotoraLogin />
            <TelaMarcadorInform />
            <TelaFullRelatEntregas />

            <div className={"areaBtnCelular"}>
              <button onClick={() => trocandoTela("mapa")}>
                <FaMapMarkedAlt />
              </button>
              <button onClick={() => trocandoTela("sidebar")}>
                <FaPeopleCarry />
              </button>
              <button onClick={() => trocandoTela("login")}>
                <FaUsers />
              </button>
            </div>
          </Mapa>
        </EntregasClientesProvedor>
      </ProvedorAutenticacao>
    </main>
  );
}
