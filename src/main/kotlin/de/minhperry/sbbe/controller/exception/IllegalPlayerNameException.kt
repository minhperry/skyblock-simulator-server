package de.minhperry.sbbe.controller.exception

class IllegalPlayerNameException(name: String) : IllegalArgumentException(
    "Player name '$name' does not match the expected format of a Minecraft player name" +
    ", which can only contain alphanumeric characters and underscores!"
)