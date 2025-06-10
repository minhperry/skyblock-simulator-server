package de.minhperry.sbbe.service

import de.minhperry.sbbe.entity.MojangPlayer
import de.minhperry.sbbe.repository.MojangPlayerRepository
import de.minhperry.sbbe.utils.UUIDUtils
import de.minhperry.sbbe.utils.UUIDUtils.toDashedUuidString
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.web.client.HttpClientErrorException
import org.springframework.web.client.RestTemplate
import java.time.Duration
import java.time.Instant
import java.util.UUID

@Service
class MojangService(
    private val mojangPlayerRepository: MojangPlayerRepository
) {
    private val restTemplate = RestTemplate()
    private val logger = LoggerFactory.getLogger(javaClass)

    private val NEGATIVE_CACHE_DURATION = Duration.ofMinutes(60)

    fun findByUuid(uuid: UUID): MojangPlayer? =
        mojangPlayerRepository.findById(uuid).orElse(saveByUuid(uuid))

    fun findPlayerByName(name: String): MojangPlayer? {
        val lowercaseName = name.lowercase()
        val existingPlayer = mojangPlayerRepository.findByName(lowercaseName)

        return if (existingPlayer.isPresent) {
            val player = existingPlayer.get()
            // If player exists or cache hasn't expired, return the player
            if (
                player.playerExists ||
                Duration.between(player.lastModified, Instant.now()) > NEGATIVE_CACHE_DURATION
            ) {
                player
            } else {
                // Cache expired, try to save again
                saveByName(lowercaseName)
            }
        } else {
            // Player not found, try to save by name
            saveByName(lowercaseName)
        }
    }

    fun saveByName(name: String): MojangPlayer? {
        val url = "https://api.minecraftservices.com/minecraft/profile/lookup/name/$name"
        return try {
            val resp = restTemplate.getForObject(url, MojangSuccessResponse::class.java)
            if (resp != null) {
                val uuid = UUID.fromString(resp.id.toDashedUuidString())
                // Save in database as lowercase name
                val player = MojangPlayer(
                    name.lowercase(),
                    uuid = uuid,
                    playerExists = true
                )
                mojangPlayerRepository.save(player)
            } else {
                logger.error("Received null response from Mojang API for player name '$name'")
                null
            }
        } catch (e: HttpClientErrorException.NotFound) {
            logger.error("Player with name '$name' not found in Mojang API", e)
            mojangPlayerRepository.save(
                MojangPlayer(
                    name.lowercase(),
                    uuid = UUIDUtils.ZERO,
                    playerExists = false
                )
            )
            null
        }
    }

    fun saveByUuid(uuid: UUID): MojangPlayer? {
        val url = "https://api.minecraftservices.com/minecraft/profile/lookup/uuid/$uuid"
        return try {
            val resp = restTemplate.getForObject(url, MojangSuccessResponse::class.java)
            if (resp != null) {
                // Save in database as lowercase name
                val player = MojangPlayer(
                    resp.name.lowercase(),
                    uuid = uuid,
                    playerExists = true
                )
                mojangPlayerRepository.save(player)
            } else {
                logger.error("Received null response from Mojang API for UUID '$uuid'")
                null
            }
        } catch (e: HttpClientErrorException.NotFound) {
            logger.error("Player with UUID '$uuid' not found in Mojang API", e)
            mojangPlayerRepository.save(
                MojangPlayer(
                    name = "$$\$Unknown$$$",
                    uuid = uuid,
                    playerExists = false
                )
            )
            null
        }
    }

    data class MojangSuccessResponse(
        val id: String,
        val name: String
    )
}