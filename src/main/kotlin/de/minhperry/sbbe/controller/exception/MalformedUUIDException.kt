package de.minhperry.sbbe.controller.exception

class MalformedUUIDException(uuid: String) : IllegalArgumentException(
    "UUID '$uuid' does not match the expected format!"
)