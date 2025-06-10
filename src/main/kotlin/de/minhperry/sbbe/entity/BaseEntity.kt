package de.minhperry.sbbe.entity

import jakarta.persistence.Column
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.MappedSuperclass
import java.io.Serializable
import java.util.Objects

@MappedSuperclass
abstract class BaseEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false, updatable = false)
    var id: Long? = null
) : Serializable {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is BaseEntity) return false
        return id == other.id
    }

    override fun hashCode(): Int {
        return Objects.hash(id)
    }

    override fun toString(): String {
        return "BaseEntity(id=$id)"
    }
}