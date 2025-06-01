package de.minhperry.sbbe.controller.exception

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler

@ControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(MalformedUUIDException::class)
    fun handleMalformedUUIDException(
        ex: MalformedUUIDException
    ): ResponseEntity<ErrorResponse> {
        val error = ErrorResponse(
            message = ex.message ?: "Malformed UUID",
            code = ResponseLabel.MALFORMED_UUID
        )
        return ResponseEntity<ErrorResponse>(error, HttpStatus.BAD_REQUEST)
    }

    @ExceptionHandler(IllegalPlayerNameException::class)
    fun handleIllegalPlayerNameException(
        ex: IllegalPlayerNameException
    ): ResponseEntity<ErrorResponse> {
        val error = ErrorResponse(
            message = ex.message ?: "Illegal player name",
            code = ResponseLabel.MALFORMED_PLAYER_NAME
        )
        return ResponseEntity<ErrorResponse>(error, HttpStatus.BAD_REQUEST)
    }

    @ExceptionHandler(PlayerNotFoundException::class)
    fun handlePlayerNotFoundException(
        ex: PlayerNotFoundException
    ): ResponseEntity<ErrorResponse> {
        val error = ErrorResponse(
            message = ex.message ?: "Player not found",
            code = ResponseLabel.PLAYER_NOT_FOUND
        )
        return ResponseEntity<ErrorResponse>(error, HttpStatus.NOT_FOUND)
    }

    @ExceptionHandler(InternalErrorException::class)
    fun handleInternalErrorException(
        ex: InternalErrorException
    ): ResponseEntity<ErrorResponse> {
        val error = ErrorResponse(
            message = ex.message ?: "Internal server error",
            code = ResponseLabel.INTERNAL_ERROR
        )
        return ResponseEntity<ErrorResponse>(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
}