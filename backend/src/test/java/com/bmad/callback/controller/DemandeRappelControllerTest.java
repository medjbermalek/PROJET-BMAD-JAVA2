package com.bmad.callback.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.bmad.callback.model.DemandeRappel;
import com.bmad.callback.repository.DemandeRappelRepository;

@SpringBootTest
@AutoConfigureMockMvc
class DemandeRappelControllerTest {

	private static final String DEMANDE_VALIDE = """
			{"nom":"Dupont","prenom":"Alice","numeroTelephone":"06 12 34 56 78",
			 "motif":"Virements","sousMotif":"Virement international","creneau":"Mercredi 14h00-14h30"}""";

	@Autowired
	private MockMvc mvc;

	@Autowired
	private DemandeRappelRepository repository;

	@BeforeEach
	void viderBase() {
		repository.deleteAll();
	}

	@Test
	void creationPubliquePersisteLaDemandeNonAppelee() throws Exception {
		mvc.perform(post("/api/demandes-rappel").contentType(MediaType.APPLICATION_JSON).content(DEMANDE_VALIDE))
			.andExpect(status().isCreated())
			.andExpect(jsonPath("$.id").isNumber())
			.andExpect(jsonPath("$.nom").value("Dupont"))
			.andExpect(jsonPath("$.creneau").value("Mercredi 14h00-14h30"))
			.andExpect(jsonPath("$.appele").value(false));

		assertEquals(1, repository.count());
		DemandeRappel enregistree = repository.findAll().get(0);
		assertEquals("Virement international", enregistree.getSousMotif());
		assertFalse(enregistree.isAppele());
	}

	@Test
	void creationRefuseUnTelephoneInvalide() throws Exception {
		String corps = DEMANDE_VALIDE.replace("06 12 34 56 78", "abc");
		mvc.perform(post("/api/demandes-rappel").contentType(MediaType.APPLICATION_JSON).content(corps))
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.status").value(400))
			.andExpect(jsonPath("$.message").value("Le numéro de téléphone est invalide"));
		assertEquals(0, repository.count());
	}

	@Test
	void creationRefuseUnSousMotifHorsReferentiel() throws Exception {
		String corps = DEMANDE_VALIDE.replace("Virement international", "Inconnu");
		mvc.perform(post("/api/demandes-rappel").contentType(MediaType.APPLICATION_JSON).content(corps))
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.message").value("Motif ou sous-motif inconnu"));
		assertEquals(0, repository.count());
	}

	@Test
	void creationRefuseUnCreneauHorsReferentiel() throws Exception {
		String corps = DEMANDE_VALIDE.replace("Mercredi 14h00-14h30", "Dimanche 10h00-10h30");
		mvc.perform(post("/api/demandes-rappel").contentType(MediaType.APPLICATION_JSON).content(corps))
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.message").value("Créneau inconnu"));
	}

	@Test
	void listeEtMiseAJourExigentUneAuthentification() throws Exception {
		DemandeRappel demande = repository.save(new DemandeRappel("Dupont", "Alice", "0612345678", "Virements",
				"Virement international", "Mercredi 14h00-14h30"));

		mvc.perform(get("/api/demandes-rappel")).andExpect(status().isUnauthorized());
		mvc.perform(patch("/api/demandes-rappel/{id}/appele", demande.getId())
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"appele\":true}"))
			.andExpect(status().isUnauthorized());
		assertFalse(repository.findById(demande.getId()).orElseThrow().isAppele());
	}

	@Test
	void conseillerAuthentifieListeLesDemandes() throws Exception {
		repository.save(new DemandeRappel("Dupont", "Alice", "0612345678", "Virements", "Virement international",
				"Mercredi 14h00-14h30"));
		repository.save(new DemandeRappel("Martin", "Marc", "0698765432", "Crédits", "Crédit immobilier",
				"Lundi 09h00-09h30"));

		mvc.perform(get("/api/demandes-rappel").with(user("admin").roles("CONSEILLER")))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.length()").value(2))
			.andExpect(jsonPath("$[0].nom").value("Dupont"))
			.andExpect(jsonPath("$[1].motif").value("Crédits"))
			.andExpect(jsonPath("$[1].appele").value(false));
	}

	@Test
	void conseillerPeutCocherPuisDecocherUneDemande() throws Exception {
		DemandeRappel demande = repository.save(new DemandeRappel("Dupont", "Alice", "0612345678", "Virements",
				"Virement international", "Mercredi 14h00-14h30"));

		mvc.perform(patch("/api/demandes-rappel/{id}/appele", demande.getId())
				.with(user("admin").roles("CONSEILLER"))
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"appele\":true}"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.appele").value(true));
		assertTrue(repository.findById(demande.getId()).orElseThrow().isAppele());

		mvc.perform(patch("/api/demandes-rappel/{id}/appele", demande.getId())
				.with(user("admin").roles("CONSEILLER"))
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"appele\":false}"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.appele").value(false));
		assertFalse(repository.findById(demande.getId()).orElseThrow().isAppele());
	}

	@Test
	void miseAJourDUneDemandeInconnueRenvoie404() throws Exception {
		mvc.perform(patch("/api/demandes-rappel/{id}/appele", 9999)
				.with(user("admin").roles("CONSEILLER"))
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"appele\":true}"))
			.andExpect(status().isNotFound())
			.andExpect(jsonPath("$.status").value(404));
	}

	@Test
	void miseAJourSansStatutRenvoie400() throws Exception {
		DemandeRappel demande = repository.save(new DemandeRappel("Dupont", "Alice", "0612345678", "Virements",
				"Virement international", "Mercredi 14h00-14h30"));
		mvc.perform(patch("/api/demandes-rappel/{id}/appele", demande.getId())
				.with(user("admin").roles("CONSEILLER"))
				.contentType(MediaType.APPLICATION_JSON)
				.content("{}"))
			.andExpect(status().isBadRequest());
	}

	@Test
	void connexionAdminOuvreUneSessionQuiDonneAccesALaListe() throws Exception {
		MvcResult connexion = mvc.perform(post("/api/auth/login").param("username", "admin").param("password", "admin"))
			.andExpect(status().isOk())
			.andReturn();
		MockHttpSession session = (MockHttpSession) connexion.getRequest().getSession(false);

		mvc.perform(get("/api/demandes-rappel").session(session)).andExpect(status().isOk());
	}

	@Test
	void connexionAvecDeMauvaisIdentifiantsEstRefusee() throws Exception {
		mvc.perform(post("/api/auth/login").param("username", "admin").param("password", "faux"))
			.andExpect(status().isUnauthorized());
		mvc.perform(post("/api/auth/login").param("username", "autre").param("password", "admin"))
			.andExpect(status().isUnauthorized());
	}

	@Test
	void deconnexionInvalideLaSession() throws Exception {
		MvcResult connexion = mvc.perform(post("/api/auth/login").param("username", "admin").param("password", "admin"))
			.andReturn();
		MockHttpSession session = (MockHttpSession) connexion.getRequest().getSession(false);

		mvc.perform(post("/api/auth/logout").session(session)).andExpect(status().isOk());
		mvc.perform(get("/api/demandes-rappel").session(session)).andExpect(status().isUnauthorized());
	}

	@Test
	void uneRouteApiNonPubliqueRenvoie401SansSession() throws Exception {
		mvc.perform(get("/api/inconnue")).andExpect(status().isUnauthorized());
	}
}
