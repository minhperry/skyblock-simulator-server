package de.minhperry.sbbe.controller.exception

data class ErrorResponse(
    val message: String,
    val code: ResponseLabel
)
