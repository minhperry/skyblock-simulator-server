package de.minhperry.sbbe.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Table
import jakarta.persistence.Id
import java.util.UUID
import org.hibernate.validator.constraints.UUID as HUUID

@Entity
@Table(name = "player")
data class Player(
    @Id
    val id: String,

    @Column(nullable = false, length = 16)
    val name: String,

    @Column(nullable = false)
    @HUUID
    val uuid: UUID
)