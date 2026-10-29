package com.bmad.callback.exception;

public class DemandeIntrouvableException extends RuntimeException {

	public DemandeIntrouvableException(Long id) {
		super("Demande de rappel introuvable : " + id);
	}
}
