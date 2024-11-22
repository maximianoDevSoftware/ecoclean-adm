"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContext } from "react";
import { contextAutenticacao } from "@/contexts/contextoUsuario";
import getSocket from "@/socket/socketCliente";

const UpdateToast = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { usuarioLogado } = useContext(contextAutenticacao);
  const socket = getSocket();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleUsersUpdate = () => {
      // Limpa o timeout anterior se existir
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      setIsVisible(true);

      // Define novo timeout para esconder o toast após 5 segundos
      timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    };

    if (socket) {
      socket.on("todos-usuarios", handleUsersUpdate);
    }

    // Cleanup
    return () => {
      if (socket) {
        socket.off("todos-usuarios", handleUsersUpdate);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [socket]);

  return (
    <AnimatePresence>
      {isVisible && usuarioLogado?.userName === "Administradores" && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[300]"
        >
          <div
            role="alert"
            aria-live="polite"
            className="bg-white rounded-lg shadow-lg px-6 py-3 text-gray-700 font-medium"
          >
            Atualizações de usuários recebidas
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpdateToast;
