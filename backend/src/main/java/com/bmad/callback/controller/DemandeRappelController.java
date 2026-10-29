package com.bmad.callback.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.bmad.callback.dto.AppeleRequest;
import com.bmad.callback.dto.DemandeRappelRequest;
import com.bmad.callback.dto.DemandeRappelResponse;
import com.bmad.callback.service.DemandeRappelService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/demandes-rappel")
public class DemandeRappelController {

	private final DemandeRappelService service;

	public DemandeRappelController(DemandeRappelService service) {
		this.service = service;
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public DemandeRappelResponse creer(@Valid @RequestBody DemandeRappelRequest request) {
		return service.creer(request);
	}

	@GetMapping
	public List<DemandeRappelResponse> lister() {
		return service.lister();
	}

	@PatchMapping("/{id}/appele")
	public DemandeRappelResponse marquerAppele(@PathVariable Long id, @Valid @RequestBody AppeleRequest request) {
		return service.marquerAppele(id, request.appele());
	}
}
