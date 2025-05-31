package de.minhperry.sbbe.entity.dto

import de.minhperry.sbbe.entity.Gamemode
import java.util.UUID

data class ProfileDTO(
    val uuid: UUID,
    val fruitName: String,
    val gameMode: Gamemode,
)
