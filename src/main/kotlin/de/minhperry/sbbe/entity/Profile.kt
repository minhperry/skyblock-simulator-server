package de.minhperry.sbbe.entity

import de.minhperry.sbbe.entity.dto.ProfileDTO
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.util.UUID

@Entity
@Table(
    name = "profile",
)
class Profile(
    val profileUuid: UUID,

    val profileFruit: String,

    @Enumerated(EnumType.STRING)
    val gamemode: Gamemode,

    @ManyToOne(optional = false)
    @JoinColumn(name = "hypixel_player_id", nullable = false)
    var hypixelPlayer: HypixelPlayer,
) : BaseEntity() {
    override fun toString(): String {
        return """
            Profile(
                uuid=$profileUuid, 
                fruit=$profileFruit, 
                gamemode=$gamemode, 
                player=${hypixelPlayer.mojangPlayer.name}
            )
        """.trimIndent()
    }

    fun asDTO(): ProfileDTO {
        return ProfileDTO(profileUuid, profileFruit, gamemode)
    }
}
