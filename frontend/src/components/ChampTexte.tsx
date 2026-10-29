interface ChampTexteProps {
  id: string
  label: string
  valeur: string
  onChange: (valeur: string) => void
  erreur?: string
  type?: 'text' | 'tel' | 'password'
  autoComplete?: string
}

function ChampTexte({ id, label, valeur, onChange, erreur, type = 'text', autoComplete }: ChampTexteProps) {
  return (
    <div className="champ">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={valeur}
        autoComplete={autoComplete}
        aria-invalid={erreur ? true : undefined}
        aria-describedby={erreur ? `${id}-erreur` : undefined}
        onChange={(evenement) => onChange(evenement.target.value)}
      />
      {erreur && (
        <p id={`${id}-erreur`} className="erreur">
          {erreur}
        </p>
      )}
    </div>
  )
}

export default ChampTexte
