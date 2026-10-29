package com.bmad.callback.dto;

import com.bmad.callback.model.DemandeRappel;

public record DemandeRappelResponse(Long id, String nom, String prenom, String numeroTelephone, String motif,
		String sousMotif, String creneau, boolean appele) {

	public static DemandeRappelResponse from(DemandeRappel demande) {
		return new DemandeRappelResponse(demande.getId(), demande.getNom(), demande.getPrenom(),
				demande.getNumeroTelephone(), demande.getMotif(), demande.getSousMotif(), demande.getCreneau(),
				demande.isAppele());
	}
}
