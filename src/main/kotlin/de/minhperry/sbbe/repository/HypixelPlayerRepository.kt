package de.minhperry.sbbe.repository

import de.minhperry.sbbe.entity.HypixelPlayer
import org.springframework.data.jpa.repository.JpaRepository

interface HypixelPlayerRepository : JpaRepository<HypixelPlayer, Long>