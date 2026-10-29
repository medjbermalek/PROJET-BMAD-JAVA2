package com.bmad.callback.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;

@Configuration
public class SecurityConfig {

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) {
		// CSRF désactivé : MVP local, cookie de session SameSite=Lax
		http
				.csrf(AbstractHttpConfigurer::disable)
				.authorizeHttpRequests(auth -> auth
						.requestMatchers(HttpMethod.POST, "/api/demandes-rappel").permitAll()
						.requestMatchers("/api/auth/**").permitAll()
						.requestMatchers("/api/**").hasRole("CONSEILLER")
						.anyRequest().permitAll())
				.formLogin(form -> form
						.loginPage("/conseiller/login")
						.loginProcessingUrl("/api/auth/login")
						.successHandler((request, response, authentication) -> response.setStatus(HttpStatus.OK.value()))
						.failureHandler((request, response, exception) -> response.setStatus(HttpStatus.UNAUTHORIZED.value())))
				.logout(logout -> logout
						.logoutUrl("/api/auth/logout")
						.logoutSuccessHandler((request, response, authentication) -> response.setStatus(HttpStatus.OK.value())))
				.exceptionHandling(exceptions -> exceptions
						.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)));
		return http.build();
	}

	@Bean
	UserDetailsService userDetailsService() {
		return new InMemoryUserDetailsManager(
				User.withUsername("admin").password("{noop}admin").roles("CONSEILLER").build());
	}
}
