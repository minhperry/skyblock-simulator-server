package de.minhperry.sbbe.controller.exception

enum class ResponseLabel(val code: String) {
    MALFORMED_UUID("MALFORMED_UUID"),
    MALFORMED_PLAYER_NAME("MALFORMED_PLAYER_NAME"),
    PLAYER_NOT_FOUND("PLAYER_NOT_FOUND"),

    ROUTE_NOT_EXIST("ROUTE_NOT_EXIST"),

    INTERNAL_ERROR("INTERNAL_ERROR")
}