package de.minhperry.sbbe.entity

import de.minhperry.sbbe.entity.dto.MojangPlayerDTO
import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Table
import jakarta.persistence.Id
import jakarta.persistence.OneToOne
import jakarta.validation.constraints.Size
import java.util.UUID

@Entity
@Table(
    name = "player",
)
class MojangPlayer(
    @Column(nullable = false, length = 16, name = "player_name")
    @Size(max = 16, message = "Minecraft name can only contain at most 16 chars")
    val name: String,

    @Id
    val uuid: UUID,

    @OneToOne(
        mappedBy = "mojangPlayer",
        cascade = [CascadeType.ALL],
        orphanRemoval = true,
        optional = false
    )
    val hypixelPlayer: HypixelPlayer? = null
) {
    fun asDTO(): MojangPlayerDTO {
        return MojangPlayerDTO(this.uuid, this.name)
    }

    override fun toString(): String {
        return "Player(uuid=$uuid, name='$name')"
    }
}