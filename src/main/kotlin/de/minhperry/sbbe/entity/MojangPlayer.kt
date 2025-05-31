package de.minhperry.sbbe.entity

import de.minhperry.sbbe.entity.dto.MojangPlayerDTO
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Table
import jakarta.persistence.Id
import jakarta.validation.constraints.Size
import java.util.UUID

@Entity
@Table(
    name = "player",
)
data class MojangPlayer(
    @Id
    val id: String,

    @Column(nullable = false, length = 16, name = "player_name")
    @Size(max = 16) // Minecraft name can only contain at most 16 chars
    val name: String,

    @Column(nullable = false, name = "player_uuid")
    val uuid: UUID,
) {
    fun asDTO(): MojangPlayerDTO {
        return MojangPlayerDTO(this.uuid, this.name)
    }

    override fun toString(): String {
        return "Player(id='$id', uuid=$uuid, name='$name')"
    }
}