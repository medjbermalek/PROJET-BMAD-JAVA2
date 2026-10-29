package com.bmad.callback.model;

import java.util.List;

public enum Motif {
	COMPTES_ET_CARTES("Comptes et cartes", List.of("Ouverture de compte", "Opposition ou renouvellement de carte")),
	VIREMENTS("Virements", List.of("Virement international", "Plafond de virement")),
	CREDITS("Crédits", List.of("Crédit immobilier", "Crédit à la consommation")),
	EPARGNE("Épargne et placements", List.of("Livret d'épargne", "Assurance-vie")),
	ASSURANCES("Assurances", List.of("Assurance habitation", "Assurance emprunteur"));

	private final String libelle;
	private final List<String> sousMotifs;

	Motif(String libelle, List<String> sousMotifs) {
		this.libelle = libelle;
		this.sousMotifs = sousMotifs;
	}

	public String getLibelle() {
		return libelle;
	}

	public List<String> getSousMotifs() {
		return sousMotifs;
	}

	public static boolean estValide(String libelle, String sousMotif) {
		for (Motif motif : values()) {
			if (motif.libelle.equals(libelle)) {
				return motif.sousMotifs.contains(sousMotif);
			}
		}
		return false;
	}
}
