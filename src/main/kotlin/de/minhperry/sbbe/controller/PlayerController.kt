package de.minhperry.sbbe.controller

import de.minhperry.sbbe.controller.exception.MalformedUUIDException
import de.minhperry.sbbe.controller.exception.PlayerNotFoundException
import de.minhperry.sbbe.entity.dto.MojangPlayerDTO
import de.minhperry.sbbe.service.MojangService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/player")
class PlayerController (
   private val mojangService: MojangService
) {
    @GetMapping("/uuid/{uuid}")
    fun getPlayerByUuid(@PathVariable("uuid") uuid: String): ResponseEntity<MojangPlayerDTO> {
        val asUuid = try {
            UUID.fromString(uuid)
        } catch (_: IllegalArgumentException) {
            throw MalformedUUIDException(uuid)
        }

        val player = mojangService.findPlayerByUuid(asUuid)

        return if (player != null) {
            ResponseEntity.ok(player.asDTO())
        } else {
            throw PlayerNotFoundException(asUuid)
        }
    }

    @GetMapping("/name/{name}")
    fun getPlayerByName(@PathVariable("name") name: String): ResponseEntity<MojangPlayerDTO> {
        val player = mojangService.findPlayerByName(name)

        return if (player != null) {
            ResponseEntity.ok(player.asDTO())
        } else {
            throw PlayerNotFoundException(name)
        }
    }
}