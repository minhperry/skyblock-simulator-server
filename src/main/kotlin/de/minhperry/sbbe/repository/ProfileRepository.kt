package de.minhperry.sbbe.repository

import de.minhperry.sbbe.entity.Profile
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface ProfileRepository : JpaRepository<Profile, UUID>