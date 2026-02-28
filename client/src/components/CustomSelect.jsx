import { useState, useRef, useEffect } from 'react'

export default function CustomSelect({ value, onChange, options, placeholder = "Select..." }) {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    const selected = options.find(o => String(o.value) === String(value))

    useEffect(() => {
        const handleClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    return (
        <div ref={ref} style={{ position: 'relative', width: '100%' }}>
            <div
                onClick={() => setOpen(!open)}
                style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 8,
                    background: '#1e293b',
                    color: selected ? '#e2e8f0' : '#475569',
                    border: open ? '1px solid #06b6d4' : '1px solid #334155',
                    fontFamily: 'monospace',
                    fontSize: 14,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                }}
            >
                <span>{selected ? selected.label : placeholder}</span>
                <span style={{
                    color: '#475569',
                    fontSize: 10,
                    transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                }}>▼</span>
            </div>

            {open && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: 4,
                    background: '#1e293b',
                    border: '1px solid #06b6d4',
                    borderRadius: 8,
                    maxHeight: 200,
                    overflowY: 'auto',
                    zIndex: 1000,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                }}>
                    {placeholder && (
                        <div
                            onClick={() => { onChange(""); setOpen(false); }}
                            style={{
                                padding: '8px 12px',
                                color: '#475569',
                                fontFamily: 'monospace',
                                fontSize: 13,
                                cursor: 'pointer',
                                transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => e.target.style.background = 'rgba(6,182,212,0.1)'}
                            onMouseLeave={e => e.target.style.background = 'transparent'}
                        >
                            {placeholder}
                        </div>
                    )}
                    {options.map(opt => (
                        <div
                            key={opt.value}
                            onClick={() => { onChange(String(opt.value)); setOpen(false); }}
                            style={{
                                padding: '8px 12px',
                                color: String(opt.value) === String(value) ? '#06b6d4' : '#e2e8f0',
                                fontFamily: 'monospace',
                                fontSize: 13,
                                cursor: 'pointer',
                                background: String(opt.value) === String(value) ? 'rgba(6,182,212,0.08)' : 'transparent',
                                transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => e.target.style.background = 'rgba(6,182,212,0.15)'}
                            onMouseLeave={e => e.target.style.background = String(opt.value) === String(value) ? 'rgba(6,182,212,0.08)' : 'transparent'}
                        >
                            {opt.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}