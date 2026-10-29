package com.bmad.callback.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bmad.callback.dto.DemandeRappelRequest;
import com.bmad.callback.dto.DemandeRappelResponse;
import com.bmad.callback.exception.DemandeIntrouvableException;
import com.bmad.callback.exception.DonneeInvalideException;
import com.bmad.callback.model.Creneau;
import com.bmad.callback.model.DemandeRappel;
import com.bmad.callback.model.Motif;
import com.bmad.callback.repository.DemandeRappelRepository;

@Service
public class DemandeRappelService {

	private final DemandeRappelRepository repository;

	public DemandeRappelService(DemandeRappelRepository repository) {
		this.repository = repository;
	}

	@Transactional
	public DemandeRappelResponse creer(DemandeRappelRequest request) {
		if (!Motif.estValide(request.motif(), request.sousMotif())) {
			throw new DonneeInvalideException("Motif ou sous-motif inconnu");
		}
		if (!Creneau.estValide(request.creneau())) {
			throw new DonneeInvalideException("Créneau inconnu");
		}
		DemandeRappel demande = new DemandeRappel(request.nom().trim(), request.prenom().trim(),
				request.numeroTelephone().trim(), request.motif(), request.sousMotif(), request.creneau());
		return DemandeRappelResponse.from(repository.save(demande));
	}

	@Transactional(readOnly = true)
	public List<DemandeRappelResponse> lister() {
		return repository.findAllByOrderByIdAsc().stream().map(DemandeRappelResponse::from).toList();
	}

	@Transactional
	public DemandeRappelResponse marquerAppele(Long id, boolean appele) {
		DemandeRappel demande = repository.findById(id).orElseThrow(() -> new DemandeIntrouvableException(id));
		demande.setAppele(appele);
		return DemandeRappelResponse.from(demande);
	}
}
