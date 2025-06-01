package de.minhperry.sbbe.service

import de.minhperry.sbbe.entity.MojangPlayer
import de.minhperry.sbbe.repository.MojangPlayerRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.web.client.HttpClientErrorException
import org.springframework.web.client.RestClientException
import org.springframework.web.client.RestTemplate
import java.util.UUID

@Service
class MojangService(
    private val mojangPlayerRepository: MojangPlayerRepository
) {
    private val restTemplate = RestTemplate()
    private val logger = LoggerFactory.getLogger(javaClass)

    fun findByUuid(uuid: UUID): MojangPlayer? =
        mojangPlayerRepository.findById(uuid).orElse(null)

    fun findByName(name: String): MojangPlayer? =
        mojangPlayerRepository.findByName(name.lowercase()).orElse(null)

    fun saveByName(name: String): MojangPlayer? {
        val url = "https://api.minecraftservices.com/minecraft/profile/lookup/name/$name"
        return try {
            val resp = restTemplate.getForObject(url, MojangSuccessResponse::class.java)
            if (resp != null) {
                val uuid = UUID.fromString(resp.id)
                // Save in database as lowercase name
                val player = MojangPlayer(name.lowercase(), uuid)
                mojangPlayerRepository.save(player)
            } else {
                logger.error("Received null response from Mojang API for player name '$name'")
                null
            }
        } catch (e: HttpClientErrorException.NotFound) {
            logger.error("Player with name '$name' not found in Mojang API", e)
            null
        }
    }

    data class MojangSuccessResponse(
        val id: String,
        val name: String
    )
}