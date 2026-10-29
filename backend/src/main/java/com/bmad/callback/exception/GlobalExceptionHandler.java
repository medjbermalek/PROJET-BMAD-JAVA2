package com.bmad.callback.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.bmad.callback.dto.ErreurApi;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(MethodArgumentNotValidException.class)
	ResponseEntity<ErreurApi> handleValidation(MethodArgumentNotValidException ex) {
		String message = ex.getBindingResult().getFieldErrors().stream()
				.map(erreur -> erreur.getDefaultMessage())
				.findFirst()
				.orElse("Requête invalide");
		return reponse(HttpStatus.BAD_REQUEST, message);
	}

	@ExceptionHandler({ DonneeInvalideException.class, HttpMessageNotReadableException.class })
	ResponseEntity<ErreurApi> handleDonneeInvalide(Exception ex) {
		String message = ex instanceof DonneeInvalideException ? ex.getMessage() : "Requête invalide";
		return reponse(HttpStatus.BAD_REQUEST, message);
	}

	@ExceptionHandler(DemandeIntrouvableException.class)
	ResponseEntity<ErreurApi> handleIntrouvable(DemandeIntrouvableException ex) {
		return reponse(HttpStatus.NOT_FOUND, ex.getMessage());
	}

	private ResponseEntity<ErreurApi> reponse(HttpStatus status, String message) {
		return ResponseEntity.status(status).body(new ErreurApi(message, status.value()));
	}
}
