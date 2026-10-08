import { useState } from 'react'

const keyOptions = [
    [
        {label: '1', name: 'One'},
        {label: '2', name: 'Two'},
        {label: '3', name: 'Three'},
    ],
    [
        {label: 'Num1', name: 'NumpadOne'},
        {label: 'Num2', name: 'NumpadTwo'},
        {label: 'Num3', name: 'NumpadThree'},
    ],
    [
        {label: 'Num-', name: 'NumpadMinus'},
        {label: 'Num+', name: 'NumpadPlus'},
        {label: 'Num0', name: 'NumpadZero'},
    ]
]

const physicsVector = {
    gravity: 'sv_soccar_gravity',
    gamespeed: 'sv_soccar_gamespeed',
    boost: 'sv_soccar_boostmodifier'
}

export function ScalarPhysicsGenerator() {
    const [scalar, setScalar] = useState(1.01639635681);
    const [keySetIdx, setKeySetIdx] = useState(0);
    const [enabled, setEnabled] = useState({ gamespeed: true, gravity: false, boost: false });
    const [showCopy, setShowCopy] = useState(false);
    const [copied, setCopied] = useState(false);

    return (
        <div>
            <h2>Scalar Binds</h2>
            <div>
                <label><input type="checkbox" checked={enabled.gamespeed} onChange={e => setEnabled(en => ({...en, gamespeed: e.target.checked}))}/> Gamespeed </label>
                <label><input type="checkbox" checked={enabled.gravity} onChange={e => setEnabled(en => ({...en, gravity: e.target.checked}))}/> Gravity </label>
                <label><input type="checkbox" checked={enabled.boost} onChange={e => setEnabled(en => ({...en, boost: e.target.checked}))}/> Boost Modifier </label>
            </div>
            <div>
                <label>Mult Value: <input type="number" step="0.01" min="1" value={scalar} onChange={e => setScalar(Number(e.target.value))} /></label>
            </div>
            <div>
                <label>Keys to Bind:&nbsp;
                    <select value={keySetIdx} onChange={e => setKeySetIdx(Number(e.target.value))}>
                        <option value={0}>1-3 (Number row)</option>
                        <option value={1}>1-3 (Numpad)</option>
                        <option value={2}>Num- Num+ Num0 (Numpad)</option>
                    </select>
                </label>
            </div>

            {(() => {
                const keySet = keyOptions[keySetIdx];
                // Compute fresh values to avoid stale closure
                const scalarVal = scalar;
                const en = enabled;
                
                const output = keySet.map((key, idx) => {
                    let parts = [];
                    
                    if (idx === 0) {
                        // Key 1: divide gamespeed & gravity, multiply boost (multiplier effect)
                        if (en.gamespeed) parts.push(`cvar_divide ${physicsVector.gamespeed} ${scalarVal}`);
                        if (en.gravity) parts.push(`cvar_divide ${physicsVector.gravity} ${scalarVal}`);
                        if (en.boost) parts.push(`cvar_mult ${physicsVector.boost} ${scalarVal}`);
                    } else if (idx === 1) {
                        // Key 2: multiply gamespeed & gravity, divide boost (inverse effect)
                        if (en.gamespeed) parts.push(`cvar_mult ${physicsVector.gamespeed} ${scalarVal}`);
                        if (en.gravity) parts.push(`cvar_mult ${physicsVector.gravity} ${scalarVal}`);
                        if (en.boost) parts.push(`cvar_divide ${physicsVector.boost} ${scalarVal}`);
                    } else {
                        // Key 3: reset all to defaults
                        if (en.gamespeed) parts.push(`${physicsVector.gamespeed} 1`);
                        if (en.gravity) parts.push(`${physicsVector.gravity} -650`);
                        if (en.boost) parts.push(`${physicsVector.boost} 1`);
                    }
                    return `bind ${key.name} "${parts.join('; ')}"`;
                });

                
                const handleCopy = () => {
                    const commandText = output.map((line, idx) => 
                        idx < output.length - 1 ? line + ';' : line
                    ).join('\n');
                    navigator.clipboard.writeText(commandText).then(() => {
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                    });
                };

                return (
                    <div style={{marginTop: '1em', position: 'relative'}}
                        onMouseEnter={() => setShowCopy(true)}
                        onMouseLeave={() => setShowCopy(false)}>
                        <h3>Generated Command:</h3>
                        <pre style={{cursor: 'pointer', position: 'relative'}} onClick={handleCopy}>
                            {output.map((line, idx) => idx < output.length - 1 ? line + ';' : line).join('\n')}
                        </pre>
                        {showCopy && output.length > 0 && (
                            <div style={{position: 'absolute', top: 30, left: 0, right: 0, textAlign: 'center', background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '0.5em', pointerEvents: 'none'}}>
                                {copied ? 'Copied!' : 'Click to copy, paste in bakkesmod console (F6)'}
                            </div>
                        )}
                    </div>
                );
            })()}
        </div>
    );
}