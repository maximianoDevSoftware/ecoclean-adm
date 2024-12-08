"use client";

import { RiAdminLine } from "react-icons/ri";
import estilo from "./telaAutenticacao.module.css";
import { useEffect, useState } from "react";

export default function FotoUsuarioLogin({
  userSelectName,
}: {
  userSelectName?: string;
}) {
  const [clienteFoto, setClienteFoto] = useState("Administradores");

  useEffect(() => {
    console.log(userSelectName);
    if (userSelectName) setClienteFoto(userSelectName);
  }, [userSelectName]);

  return (
    <div className={`${estilo.areaComFotoUsuarioSelect}`}>
      <div className={`${estilo.fotoUsuarioParaLogin}`}>
        {clienteFoto == "Marcos" && (
          <>
            <div className={estilo.fotoMarcosUsuarioLogin}></div>
          </>
        )}
        {clienteFoto == "Uene" && (
          <>
            <div className={estilo.fotoUeneUsuarioLogin}></div>
          </>
        )}

        {clienteFoto == "Leo" && (
          <>
            <div className={estilo.fotoLeoUsuarioLogin}></div>
          </>
        )}

        {clienteFoto == "João" && (
          <>
            <div className={estilo.fotoJoaoUsuarioLogin}></div>
          </>
        )}

        {clienteFoto == "Administradores" && (
          <div className={estilo.fotoAdmnistradoresLogin}>
            <RiAdminLine />
          </div>
        )}
      </div>
    </div>
  );
}
