package com.bmad.callback.dto;

import jakarta.validation.constraints.NotNull;

public record AppeleRequest(@NotNull(message = "Le statut est obligatoire") Boolean appele) {
}
