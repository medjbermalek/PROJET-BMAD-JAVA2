package com.bmad.callback.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bmad.callback.model.DemandeRappel;

public interface DemandeRappelRepository extends JpaRepository<DemandeRappel, Long> {

	List<DemandeRappel> findAllByOrderByIdAsc();
}
