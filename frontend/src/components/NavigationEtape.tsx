interface NavigationEtapeProps {
  onRetour: () => void
  libelleContinuer?: string
  desactive?: boolean
}

function NavigationEtape({ onRetour, libelleContinuer = 'Continuer', desactive = false }: NavigationEtapeProps) {
  return (
    <div className="actions">
      <button type="button" className="bouton-secondaire" onClick={onRetour}>
        Retour
      </button>
      <button type="submit" className="bouton-principal" disabled={desactive}>
        {libelleContinuer}
      </button>
    </div>
  )
}

export default NavigationEtape
