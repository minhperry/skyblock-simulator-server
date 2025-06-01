package de.minhperry.sbbe.controller.exception

import java.util.UUID

class PlayerNotFoundException: RuntimeException {
    constructor(name: String) : super("Player with name $name not found in database")

    constructor(uuid: UUID) : super("Player with UUID $uuid not found in database")
}
