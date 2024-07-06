"use client";
import React, { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';

const Xterm = () => {
  const terminalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const term = new Terminal();
    if (terminalRef.current) {
      term.open(terminalRef.current);
      term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ');

      term.onKey(({ key, domEvent }) => {
        const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

        if (domEvent.keyCode === 13) {
          // Enter key
          term.write('\r\n$ ');
        } else if (domEvent.keyCode === 8) {
          // Backspace key
          if (term.buffer.active.cursorX > 2) {
            term.write('\b \b');
          }
        } else if (printable) {
          term.write(key);
        }
      });
    }

    return () => {
      term.dispose();
    };
  }, []);

  return <div ref={terminalRef} style={{ width: '100%', height: '100%' }}></div>;
};

export default Xterm;
