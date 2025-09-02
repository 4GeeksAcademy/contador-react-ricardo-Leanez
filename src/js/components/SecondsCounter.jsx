import React, { useEffect, useState, useRef } from 'react';

function Digit({value}) {
  return (
    <div className="bg-dark text-white mx-1 px-3 py-3 rounded" style={{fontSize: '2rem', fontFamily: 'monospace', minWidth: '50px', textAlign: 'center'}}>
      {value}
    </div>
  );
}

export default function SecondsCounter({ initialSeconds = 0 }) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(true);
  const [target, setTarget] = useState('');
  const alertShownRef = useRef(false);

  // Incrementar segundos cada segundo si está corriendo
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  // Alertar cuando se alcanza tiempo objetivo
  useEffect(() => {
    if (target && seconds >= Number(target) && !alertShownRef.current) {
      alert(`¡Has alcanzado el tiempo objetivo: ${target} segundos!`);
      alertShownRef.current = true;
      setRunning(false);
    }
  }, [seconds, target]);

  // Convertir segundos a un array de dígitos (6 dígitos)
  const digits = seconds.toString().padStart(6, '0').split('');

  // Funciones botones control
  const handleStop = () => setRunning(false);
  const handleStart = () => {
    alertShownRef.current = false;
    setRunning(true);
  };
  const handleReset = () => {
    setSeconds(0);
    alertShownRef.current = false;
    setRunning(false);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center">
        <i className="fa-regular fa-clock fa-3x me-3"></i>
        {digits.map((d, i) => <Digit key={i} value={d} />)}
      </div>

      <div className="mt-3 d-flex align-items-center gap-2 flex-wrap">
        <input 
          type="number" 
          className="form-control" 
          placeholder="Tiempo objetivo (segundos)" 
          style={{maxWidth: '200px'}}
          value={target}
          onChange={e => {
            alertShownRef.current = false;
            setTarget(e.target.value);
            if (e.target.value === '') setRunning(true);
          }}
          min="1"
        />
        <button className="btn btn-primary" onClick={handleStart} disabled={running}>Iniciar</button>
        <button className="btn btn-warning" onClick={handleStop} disabled={!running}>Pausar</button>
        <button className="btn btn-danger" onClick={handleReset}>Reiniciar</button>
      </div>
    </div>
  );
}