"use client";
import { ProvedorAutenticacao } from "@/contexts/contextoUsuario";
import { EntregasClientesProvedor } from "@/contexts/entregasClientesContext";
import { SideBar } from "./sideBar/sideBar";
import dynamic from "next/dynamic";
import ClientesEntregas from "./telasFull/clientesEntrega";
import NovoClienteEntregas from "./telasFull/novoClienteEntrega";
import { TelaFullRelatEntregas } from "./Relatorio Entregas/telaRelEntregas";

const Mapa = dynamic(() => import("./mapa/meuMapa"), { ssr: false });
const MotoraLogin = dynamic(() => import("./usuariosLogados/motoristaLogin"), {
  ssr: false,
});
const TelaMarcadorInform = dynamic(
  () => import("./informsMarcador/informsMarcador"),
  { ssr: false }
);

export default function Home() {
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
          </Mapa>
        </EntregasClientesProvedor>
      </ProvedorAutenticacao>
    </main>
  );
}
