"use client";
import React, { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import ip from "@/app/globalvariables";
import "@xterm/xterm/css/xterm.css";
import { io } from "socket.io-client";
import { WebLinksAddon } from "@xterm/addon-web-links";
import { FitAddon } from "@xterm/addon-fit";
import Header from "@/app/components/header";


const Xterm = ({params}:any) => {
    const id=params.termid;
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
            socketRef.current.emit(`data-${id}`, key); }// Send the key to the server
          });
          terminalRef.current.attachCustomKeyEventHandler((arg:any) => {
            if (arg.ctrlKey && arg.code === "KeyV" && arg.type === "keydown") {
                navigator.clipboard.readText()
                  .then(text => {
                    socketRef.current.emit(`data-${id}`, text); 
                  })
            }
            return true;
        });
          // termDiv.current.addEventListener('contextmenu', () => {
          //   if (term.hasSelection()) {
          //     socketRef.current.emit(`data-${id}`, key); 
          //     terminalRef.current.select(0, 0, 0);
          //   } else {
          //     // ipcRenderer.send('terminal-data', clipboard.readText())
          //     socketRef.current.emit(`data-${id}`, key); 
          //   }
          // })
          // terminalRef.current.attachCustomKeyEventHandler((event:any) => {
          //   event.preventDefault();
          //   console.log("How Much");
          //   if (event.ctrlKey === true && event.key === 'v') {
          //     let i = 1;
          //     navigator.clipboard.readText().then(text => {
          //       if (i == 1) {
          //         console.log(text);
          //         console.log(event.ctrlKey);
          //         i = i + 1;
          //         socketRef.current.emit(`data-${id}`, text);
          //       }
          //     });
          //     return false; // Prevent the default action
          //   }
          //   return true;
          // });
        }
        return () => {
          terminalRef.current.dispose();
        };
      }, []);

    useEffect(() => {
      const socket = io(`${ip}?termID=${id}` ,{/*+ "/"*/});
      socketRef.current = socket;
      socketRef.current.on(`data-${id}`, (message: any) => {
        if (terminalRef.current != null) {
          terminalRef.current.write(message);
        }
      });
  
    //   setSocket(socket);
    }, []);
  
   
  
    return (
      <div>
        
      <div ref={termDiv} style={{ width: "100%", height: "100%" }}></div>
      </div>
    );
  };
  
  export default Xterm;