package de.minhperry.sbbe.entity

import de.minhperry.sbbe.entity.dto.MojangPlayerDTO
import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Table
import jakarta.persistence.OneToOne
import jakarta.validation.constraints.Size
import java.time.Instant
import java.util.UUID

/**
 * Represents a Minecraft player as stored in the Mojang API.
 * @param name The player's Minecraft name, which can be at most 16 characters long.
 * @param uuid The player's unique identifier (UUID).
 * @param playerExists Indicates whether the player exists in the Mojang API.
 * @param lastModified The last time this player was modified in the database.
 */
@Entity
@Table(
    name = "player",
)
class MojangPlayer(
    @Column(nullable = false, length = 16, name = "player_name")
    @Size(max = 16, message = "Minecraft name can only contain at most 16 chars")
    val name: String,

    @Column(name = "player_uuid", nullable = false, unique = true, columnDefinition = "uuid")
    val uuid: UUID,

    @Column(name = "exist", nullable = false)
    var playerExists: Boolean = false,

    var lastModified: Instant = Instant.now(),

    @OneToOne(
        mappedBy = "mojangPlayer",
        cascade = [CascadeType.ALL],
        orphanRemoval = true,
        optional = false
    )
    val hypixelPlayer: HypixelPlayer? = null,
) : BaseEntity() {
    fun asDTO(): MojangPlayerDTO {
        return MojangPlayerDTO(this.uuid, this.name)
    }

    override fun toString(): String {
        return "Player(uuid=$uuid, name='$name')"
    }
}