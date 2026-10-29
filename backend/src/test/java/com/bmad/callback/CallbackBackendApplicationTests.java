package com.bmad.callback;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.forwardedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class CallbackBackendApplicationTests {

	@Autowired
	private MockMvc mvc;

	@Test
	void contextLoads() {
	}

	@Test
	void frontendRoutesServeIndexHtml() throws Exception {
		for (String path : new String[] { "/client/identite", "/client/motif", "/client/creneau",
				"/client/recapitulatif", "/client/confirmation", "/conseiller/login", "/conseiller/dashboard" }) {
			mvc.perform(get(path))
				.andExpect(status().isOk())
				.andExpect(forwardedUrl("/index.html"));
		}
	}

}
