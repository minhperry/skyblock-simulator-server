package de.minhperry.sbbe.repository

import de.minhperry.sbbe.entity.MojangPlayer
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID


interface MojangPlayerRepository : JpaRepository<MojangPlayer, UUID>