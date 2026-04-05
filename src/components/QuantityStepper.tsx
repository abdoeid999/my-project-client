type Props = {
  value: number
  min?: number
  max?: number
  onChange: (nextValue: number) => void
  disabled?: boolean
}

export default function QuantityStepper({ value, min = 1, max, onChange, disabled }: Props) {
  const clamped = Math.max(min, Math.min(max ?? value, value))

  const decDisabled = disabled || clamped <= min
  const incDisabled = disabled || (typeof max === 'number' && clamped >= max)

  const stepDown = () => {
    if (decDisabled) return
    onChange(Math.max(min, clamped - 1))
  }

  const stepUp = () => {
    if (incDisabled) return
    onChange(Math.min(max ?? clamped + 1, clamped + 1))
  }

  return (
    <div className="inline-flex items-center rounded-xl border bg-white/60 p-1 dark:border-slate-800 dark:bg-slate-900/30">
      <button
        type="button"
        onClick={stepDown}
        disabled={decDisabled}
        className="h-9 w-9 rounded-lg text-lg text-slate-700 transition hover:bg-white disabled:opacity-40 dark:text-slate-200 dark:hover:bg-slate-900"
        aria-label="Decrease quantity"
      >
        -
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={clamped}
        onChange={(e) => {
          const n = Number(e.target.value) || min
          const next = Math.max(min, Math.min(max ?? n, n))
          onChange(next)
        }}
        className="w-16 bg-transparent text-center text-sm font-semibold text-slate-900 outline-none dark:text-white"
        aria-label="Quantity"
        disabled={disabled}
      />
      <button
        type="button"
        onClick={stepUp}
        disabled={incDisabled}
        className="h-9 w-9 rounded-lg text-lg text-slate-700 transition hover:bg-white disabled:opacity-40 dark:text-slate-200 dark:hover:bg-slate-900"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  )
}

