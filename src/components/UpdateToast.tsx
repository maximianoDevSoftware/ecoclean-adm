"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContext } from "react";
import { contextAutenticacao } from "@/contexts/contextoUsuario";
import { BsPersonFillCheck } from "react-icons/bs";
import getSocket from "@/socket/socketCliente";

const UpdateToast = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { usuarioLogado } = useContext(contextAutenticacao);
  const socket = getSocket();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleUsersUpdate = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      setIsVisible(true);

      timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    };

    if (socket) {
      socket.on("todos-usuarios", handleUsersUpdate);
    }

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
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3 }}
          className="fixed top-4 right-4 z-[300]"
        >
          <div className="w-10 h-10 rounded-full bg-gray-800/30 backdrop-blur-sm flex items-center justify-center shadow-[0_0_15px_rgb(34,197,94)]">
            <BsPersonFillCheck className="text-2xl text-green-500 animate-pulse shadow-[0_0_8px_rgb(34,197,94)]" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpdateToast;
