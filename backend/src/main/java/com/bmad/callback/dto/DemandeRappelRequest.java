package com.bmad.callback.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record DemandeRappelRequest(
		@NotBlank(message = "Le nom est obligatoire") @Size(max = 100, message = "Le nom est trop long") String nom,
		@NotBlank(message = "Le prénom est obligatoire") @Size(max = 100, message = "Le prénom est trop long") String prenom,
		@NotBlank(message = "Le numéro de téléphone est obligatoire")
		@Pattern(regexp = "^\\+?[0-9 .()-]{8,20}$", message = "Le numéro de téléphone est invalide") String numeroTelephone,
		@NotBlank(message = "Le motif est obligatoire") String motif,
		@NotBlank(message = "Le sous-motif est obligatoire") String sousMotif,
		@NotBlank(message = "Le créneau est obligatoire") String creneau) {
}
