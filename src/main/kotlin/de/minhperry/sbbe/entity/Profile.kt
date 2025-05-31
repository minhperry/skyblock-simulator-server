package de.minhperry.sbbe.entity

import de.minhperry.sbbe.entity.dto.ProfileDTO
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.UUID

@Entity
@Table(
    name = "profile",
)
data class Profile(
    @Id
    val id: String,

    @Column(nullable = false, name = "profile_uuid")
    val uuid: UUID,

    @Column(nullable = false, name = "profile_name")
    val name: String,

    @Column(nullable = false, name = "game_mode")
    val gamemode: Gamemode
) {
    override fun toString(): String {
        return "Profile(id='$id', uuid=$uuid, name='$name')"
    }

    fun asDTO(): ProfileDTO {
        return ProfileDTO(uuid, name, gamemode)
    }
}
