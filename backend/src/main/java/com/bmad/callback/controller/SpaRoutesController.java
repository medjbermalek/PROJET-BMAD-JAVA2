package com.bmad.callback.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
class SpaRoutesController {

	@GetMapping({ "/client/{etape}", "/conseiller/{page}" })
	String forwardToFrontend() {
		return "forward:/index.html";
	}
}
