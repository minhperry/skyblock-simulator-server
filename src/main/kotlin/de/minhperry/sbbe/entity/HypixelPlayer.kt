package de.minhperry.sbbe.entity

import jakarta.persistence.CascadeType
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.OneToMany
import jakarta.persistence.OneToOne
import jakarta.persistence.Table
import java.io.Serializable

@Entity
@Table(
    name = "hypixel_player",
)
class HypixelPlayer(
    @OneToOne(optional = false)
    @JoinColumn(
        name = "mojang_uuid",
        referencedColumnName = "id",
        nullable = false,
        unique = true
    )
    val mojangPlayer: MojangPlayer,

    @OneToMany(
        mappedBy = "hypixelPlayer",
        cascade = [CascadeType.ALL],
        orphanRemoval = true
    )
    val profiles: MutableList<Profile> = mutableListOf(),
) : BaseEntity()
