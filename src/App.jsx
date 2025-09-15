import { useState, useEffect } from 'react'
import './App.css'

const keyOptions = [
  // Display names, actual console names
  [
    {label: '1', name: 'One'},
    {label: '2', name: 'Two'},
    {label: '3', name: 'Three'},
    {label: '4', name: 'Four'},
    {label: '5', name: 'Five'},
    {label: '6', name: 'Six'},
    {label: '7', name: 'Seven'},
    {label: '8', name: 'Eight'},
    {label: '9', name: 'Nine'},
    {label: '0', name: 'Zero'}
  ],
  [
    {label: 'Q', name: 'Q'},
    {label: 'W', name: 'W'},
    {label: 'E', name: 'E'},
    {label: 'R', name: 'R'},
    {label: 'T', name: 'T'},
    {label: 'Y', name: 'Y'},
    {label: 'U', name: 'U'},
    {label: 'I', name: 'I'},
    {label: 'O', name: 'O'},
    {label: 'P', name: 'P'}
  ],
  [
    {label: 'Numpad1', name: 'NumpadOne'},
    {label: 'Numpad2', name: 'NumpadTwo'},
    {label: 'Numpad3', name: 'NumpadThree'},
    {label: 'Numpad4', name: 'NumpadFour'},
    {label: 'Numpad5', name: 'NumpadFive'},
    {label: 'Numpad6', name: 'NumpadSix'},
    {label: 'Numpad7', name: 'NumpadSeven'},
    {label: 'Numpad8', name: 'NumpadEight'},
    {label: 'Numpad9', name: 'NumpadNine'},
    {label: 'Numpad0', name: 'NumpadZero'}
  ]
];

function App() {
  const [enabled, setEnabled] = useState({ gamespeed: true, gravity: false, boost: false });
  const [values, setValues] = useState({
    gamespeed: { min: 0.666, max: 1 },
    gravity: { min: 0.8, max: 1 },
    boost: { min: 1.05, max: 1 }
  });
  const [keySetIdx, setKeySetIdx] = useState(0);
  const [output, setOutput] = useState([]);
  const [showCopy, setShowCopy] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const keySet = keyOptions[keySetIdx];
    const n = keySet.length;
    let commands = keySet.map((key, idx) => {
      let parts = [];
      if (enabled.gamespeed) {
        let gs = values.gamespeed.min + ((values.gamespeed.max - values.gamespeed.min) / (n - 1)) * idx;
        gs = Number(gs.toFixed(4));
        parts.push(`sv_soccar_gamespeed ${gs}`);
      }
      if (enabled.gravity) {
        let grav = -650 * (values.gravity.min + ((values.gravity.max - values.gravity.min) / (n - 1)) * idx);
        grav = Number(grav.toFixed(4));
        parts.push(`sv_soccar_gravity ${grav}`);
      }
      if (enabled.boost) {
        let boost = values.boost.min + ((values.boost.max - values.boost.min) / (n - 1)) * idx;
        boost = Number(boost.toFixed(4));
        parts.push(`sv_soccar_boostmodifier ${boost}`);
      }
      return `bind ${key.name} "${parts.join('; ')}"`;
    });
    setOutput(commands);
  }, [enabled, values, keySetIdx]);

  const handleValueChange = (mod, field, val) => {
    setValues(v => ({
      ...v,
      [mod]: { ...v[mod], [field]: Number(val) }
    }));
  };

  const handleCopy = () => {
    const text = output.map((line, idx) => idx < output.length - 1 ? line + ';' : line).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="App">
      <h2>RL Physics Binds Generator</h2>
      <div>
        <label><input type="checkbox" checked={enabled.gamespeed} onChange={e => setEnabled(en => ({...en, gamespeed: e.target.checked}))}/> Gamespeed</label>
        <label>Start: <input type="number" step="0.01" value={values.gamespeed.min} onChange={e => handleValueChange('gamespeed', 'min', e.target.value)} /></label>
        <label>End: <input type="number" step="0.01" value={values.gamespeed.max} onChange={e => handleValueChange('gamespeed', 'max', e.target.value)} /></label>
      </div>
      <div>
        <label><input type="checkbox" checked={enabled.gravity} onChange={e => setEnabled(en => ({...en, gravity: e.target.checked}))}/> Gravity</label>
        <label>Start: <input type="number" step="0.01" value={values.gravity.min} onChange={e => handleValueChange('gravity', 'min', e.target.value)} /></label>
        <label>End: <input type="number" step="0.01" value={values.gravity.max} onChange={e => handleValueChange('gravity', 'max', e.target.value)} /></label>
      </div>
      <div>
        <label><input type="checkbox" checked={enabled.boost} onChange={e => setEnabled(en => ({...en, boost: e.target.checked}))}/> Boost</label>
        <label>Start: <input type="number" step="0.01" value={values.boost.min} onChange={e => handleValueChange('boost', 'min', e.target.value)} /></label>
        <label>End: <input type="number" step="0.01" value={values.boost.max} onChange={e => handleValueChange('boost', 'max', e.target.value)} /></label>
      </div>
      <div>
        <label>Key Range:&nbsp;
          <select value={keySetIdx} onChange={e => setKeySetIdx(Number(e.target.value))}>
            <option value={0}>1-0 (Number row)</option>
            <option value={1}>Q-P</option>
            <option value={2}>Numpad1-Numpad0</option>
          </select>
        </label>
      </div>
      <div style={{marginTop: '1em', position: 'relative'}}
           onMouseEnter={() => setShowCopy(true)}
           onMouseLeave={() => setShowCopy(false)}>
        <h3>Generated Command:</h3>
        <pre style={{cursor: 'pointer', position: 'relative'}} onClick={handleCopy}>
          {output.map((line, idx) => idx < output.length - 1 ? line + ';' : line).join('\n')}
        </pre>
        {showCopy && output.length > 0 && (
          <div style={{position: 'absolute', top: 30, left: 0, right: 0, textAlign: 'center', background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '0.5em', pointerEvents: 'none'}}>
            {copied ? 'Copied!' : 'Click to copy'}
          </div>
        )}
      </div>
    </div>
  );
}

export default App
