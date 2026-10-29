package com.bmad.callback.model;

import java.util.ArrayList;
import java.util.List;

public final class Creneau {

	private static final List<String> JOURS_SEMAINE = List.of("Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi");
	private static final List<String> HORAIRES_SEMAINE = List.of("09h00-09h30", "11h00-11h30", "14h00-14h30", "16h30-17h00");
	private static final List<String> HORAIRES_SAMEDI = List.of("09h00-09h30", "10h00-10h30", "11h00-11h30");

	private static final List<String> TOUS = construire();

	private Creneau() {
	}

	public static List<String> tous() {
		return TOUS;
	}

	public static boolean estValide(String creneau) {
		return TOUS.contains(creneau);
	}

	private static List<String> construire() {
		List<String> creneaux = new ArrayList<>();
		for (String jour : JOURS_SEMAINE) {
			for (String horaire : HORAIRES_SEMAINE) {
				creneaux.add(jour + " " + horaire);
			}
		}
		for (String horaire : HORAIRES_SAMEDI) {
			creneaux.add("Samedi " + horaire);
		}
		return List.copyOf(creneaux);
	}
}
