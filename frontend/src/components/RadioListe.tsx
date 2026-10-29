interface Option {
  value: string
  label: string
}

interface RadioListeProps {
  name: string
  legend: string
  options: Option[]
  valeur: string | null
  onChange: (valeur: string) => void
}

function RadioListe({ name, legend, options, valeur, onChange }: RadioListeProps) {
  return (
    <fieldset className="radio-liste">
      <legend>{legend}</legend>
      {options.map((option) => (
        <label key={option.value} className="radio-option">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={valeur === option.value}
            onChange={() => onChange(option.value)}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </fieldset>
  )
}

export default RadioListe
