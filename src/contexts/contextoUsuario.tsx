"use client";

import React, {
  createContext,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import estilo from "@/styles/telaAutenticacao.module.css";
import { usuarioTipo } from "@/types/userTypes";
import getSocket from "../socket/socketCliente"; // Importando o singleton do socket
import FotoUsuarioLogin from "./components/fotoUsuario";
import { BiLoaderAlt } from "react-icons/bi";

/**Incializando conexão com webSocket */
const socket = getSocket(); // Obtendo a instância do socket

interface AuntenticInterface {
  usuarioLogado: usuarioTipo | undefined;
  marcosUser: usuarioTipo;
  ueneUser: usuarioTipo;
  leoUser: usuarioTipo;
  joaoUser: usuarioTipo;
}
export const contextAutenticacao = createContext<AuntenticInterface>({} as any);

export function ProvedorAutenticacao({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const telaAutenticacao = useRef<HTMLDivElement>(null);

  // socket.emit("Buscar Entregas");

  const [usuarioLogado, setUsuarioLogado] = useState<usuarioTipo>({
    userName: "",
    senha: "",
    status: "",
    localizacao: {
      latitude: 0,
      longitude: 0,
    },
  });

  const [admUser, setAdmUser] = useState<usuarioTipo>({
    userName: "Administradores",
    status: "Carregando",
    senha: "ecoadm",
    localizacao: {
      latitude: 0,
      longitude: 0,
    },
  });

  const [marcosUser, setMarcosUser] = useState<usuarioTipo>({
    userName: "Marcos",
    status: "Carregando",
    senha: "ecomarcos",
    localizacao: {
      latitude: -25.8242341,
      longitude: -48.5410957,
    },
  });
  const [ueneUser, setUeneUser] = useState<usuarioTipo>({
    userName: "Uene",
    status: "Carregando",
    senha: "ecouene",
    localizacao: {
      latitude: 0,
      longitude: 0,
    },
  });
  const [leoUser, setLeoUser] = useState<usuarioTipo>({
    userName: "Leo",
    status: "Carregando",
    senha: "ecoleo",
    localizacao: {
      latitude: 0,
      longitude: 0,
    },
  });
  const [joaoUser, setJoaoUser] = useState<usuarioTipo>({
    userName: "Joao",
    status: "Carregando",
    senha: "ecojoao",
    localizacao: {
      latitude: 0,
      longitude: 0,
    },
  });

  const [dadosForm, setDadosForm] = useState({
    userName: "Administradores",
    senha: "ecoadm",
  });

  const [estaAutenticando, setEstaAutenticando] = useState(false);
  const [dadosCarregados, setDadosCarregados] = useState(false);

  const atualizandoFormulario = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setDadosForm({
      ...dadosForm,
      [event.target.name]: event.target.value,
    });
  };

  const atualizandoTodosUsuarios = () => {
    socket.emit("solicitar-usuarios");
  };

  const autenticandoFormulario = (ev: FormEvent) => {
    ev.preventDefault();
    setEstaAutenticando(true);
    console.log(`Autenticando usuario: ${dadosForm.userName}`);
    socket.emit("Autenticar Usuario", dadosForm);
  };

  /**Effect que recebe do servidor o usuário que foi logado, e define o estado dele dentro do context client administrador */
  useEffect(() => {
    setTimeout(() => {
      setDadosCarregados(true);
    }, 2000);

    socket.on(
      "Usuario Autenticado",
      async (usuarioAutenticadoServidor: usuarioTipo) => {
        setEstaAutenticando(false);
        atualizandoTodosUsuarios();
        if (usuarioAutenticadoServidor.userName) {
          setUsuarioLogado(usuarioAutenticadoServidor);
          if (usuarioAutenticadoServidor.userName === "Marcos") {
            setMarcosUser(usuarioAutenticadoServidor);
          } else if (usuarioAutenticadoServidor.userName === "Uene") {
            setUeneUser(usuarioAutenticadoServidor);
          } else if (usuarioAutenticadoServidor.userName === "Leo") {
            setLeoUser(usuarioAutenticadoServidor);
          } else if (usuarioAutenticadoServidor.userName === "João") {
            setJoaoUser(usuarioAutenticadoServidor);
          } else if (
            usuarioAutenticadoServidor.userName === "Administradores"
          ) {
            setAdmUser(usuarioAutenticadoServidor);
          }
        }
        socket.on("localizando-motoristas", (user: usuarioTipo) => {
          if (user.userName) {
            setUsuarioLogado(user);
            if (user.userName === "Marcos") {
              setMarcosUser(user);
            } else if (user.userName === "Uene") {
              setUeneUser(user);
            } else if (user.userName === "Leo") {
              setLeoUser(user);
            } else if (user.userName === "João") {
              setJoaoUser(user);
            } else if (user.userName === "Administradores") {
              setAdmUser(user);
            }
          }
        });

        socket.on("todos-usuarios", (todosUsuarios: usuarioTipo[]) => {
          console.log("Todos os usuários foram atualizados com sucesso!");
          console.log(todosUsuarios);
          todosUsuarios.map((usuario: usuarioTipo) => {
            if (usuario.userName === "Marcos") {
              setMarcosUser(usuario);
            } else if (usuario.userName === "Uene") {
              setUeneUser(usuario);
            } else if (usuario.userName === "Leo") {
              setLeoUser(usuario);
            } else if (usuario.userName === "João") {
              setJoaoUser(usuario);
            } else if (usuario.userName === "Administradores") {
              setAdmUser(usuario);
            }
          });
        });

        telaAutenticacao.current?.classList.toggle(estilo.telaAutenticFora);
        console.log(
          "Usuário autenticado com sucesso. Seu nome: " +
            usuarioAutenticadoServidor.userName
        );
      }
    );

    return () => {
      socket.off("Usuario Autenticado");
      socket.off("localizando-motoristas");
      socket.off("todos-usuarios");
    };
  }, []);

  /**Effect para ouvir alterações nas localizações dos motoristas */

  return (
    <contextAutenticacao.Provider
      value={{ usuarioLogado, marcosUser, ueneUser, leoUser, joaoUser }}
    >
      <>
        <div
          className={`${estilo.telaAutenticacao} ${estilo.telaAutenticForaaaaa}`}
          ref={telaAutenticacao}
        >
          <div className={estilo.ondaExtra}></div>
          <div className={estilo.areaLogin}>
            <FotoUsuarioLogin
              userSelectName={`${dadosForm.userName}`}
            ></FotoUsuarioLogin>

            {!dadosCarregados ? (
              <div className="flex flex-col items-center justify-center gap-4 p-8">
                <BiLoaderAlt className="text-4xl text-white animate-spin" />
                <span className="text-white text-sm">
                  Carregando dados do sistema...
                </span>
              </div>
            ) : (
              <form
                className={estilo.formAutent}
                onSubmit={autenticandoFormulario}
              >
                <select name="userName" onChange={atualizandoFormulario}>
                  <option value="Administradores">Administradores</option>
                  <option value="Marcos">Marcos</option>
                  <option value="Uene">Uene</option>
                  <option value="Leo">Leo</option>
                  <option value="João">João</option>
                  <option value="Dev">Dev</option>
                </select>

                <input
                  type="text"
                  name="senha"
                  placeholder="Sua senha"
                  value={dadosForm.senha}
                  onChange={atualizandoFormulario}
                />

                <button
                  type="submit"
                  disabled={estaAutenticando}
                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {estaAutenticando ? "Autenticando usuário..." : "LOGIN"}
                </button>
              </form>
            )}
          </div>
        </div>
        {children}
      </>
    </contextAutenticacao.Provider>
  );
}
