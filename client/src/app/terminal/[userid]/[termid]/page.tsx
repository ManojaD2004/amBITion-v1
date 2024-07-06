"use client";
import React, { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import ip from "@/app/globalvariables";
import "@xterm/xterm/css/xterm.css";
import { io } from "socket.io-client";
import { WebLinksAddon } from "@xterm/addon-web-links";
import { FitAddon } from "@xterm/addon-fit";

const Xterm = () => {
    const terminalRef = useRef<any | null>(null);
    const termDiv = useRef<any>(null);
    const socketRef = useRef<any | null>(null);
    // const [socket, setSocket] = useState<any>(undefined);
  
    useEffect(() => {
        const term = new Terminal({
            theme: {
              background: "#00000",
              foreground: "white",
              cursor: "white",
    
            },
          });
        term.loadAddon(new WebLinksAddon());

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
        terminalRef.current = term;
        fitAddon.fit();
        if (terminalRef.current != null) {
  
          terminalRef.current.open(termDiv.current);
          // term.write("Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ");
    
          terminalRef.current.onKey(({ key, domEvent }:any) => {
            if (socketRef.current!=null){
            socketRef.current.emit("data", key); }// Send the key to the server
          });
        }
        return () => {
          term.dispose();
        };
      }, []);

    useEffect(() => {
      const socket = io(ip ,{/*+ "/"*/});
      socketRef.current = socket;
      socketRef.current.on("data", (message: any) => {
        if (terminalRef.current != null) {
          terminalRef.current.write(message);
        }
      });
  
    //   setSocket(socket);
    }, []);
  
   
  
    return (
      <div ref={termDiv} style={{ width: "100%", height: "100%" }}></div>
    );
  };
  
  export default Xterm;