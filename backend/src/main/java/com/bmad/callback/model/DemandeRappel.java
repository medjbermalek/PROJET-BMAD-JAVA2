package com.bmad.callback.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class DemandeRappel {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String nom;
	private String prenom;
	private String numeroTelephone;
	private String motif;
	private String sousMotif;
	private String creneau;
	private boolean appele;

	protected DemandeRappel() {
	}

	public DemandeRappel(String nom, String prenom, String numeroTelephone, String motif, String sousMotif, String creneau) {
		this.nom = nom;
		this.prenom = prenom;
		this.numeroTelephone = numeroTelephone;
		this.motif = motif;
		this.sousMotif = sousMotif;
		this.creneau = creneau;
		this.appele = false;
	}

	public Long getId() {
		return id;
	}

	public String getNom() {
		return nom;
	}

	public String getPrenom() {
		return prenom;
	}

	public String getNumeroTelephone() {
		return numeroTelephone;
	}

	public String getMotif() {
		return motif;
	}

	public String getSousMotif() {
		return sousMotif;
	}

	public String getCreneau() {
		return creneau;
	}

	public boolean isAppele() {
		return appele;
	}

	public void setAppele(boolean appele) {
		this.appele = appele;
	}
}
