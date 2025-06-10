package de.minhperry.sbbe.utils

object UUIDUtils {
    fun String.toDashedUuidString(): String {
        val uuid = this
        return if (uuid.length == 32) {
            """${uuid.substring(0, 8)}
                -${uuid.substring(8, 12)}
                -${uuid.substring(12, 16)}
                -${uuid.substring(16, 20)}
                -${uuid.substring(20)}"""
                .replace("\n", "")
                .replace(" ", "")
        } else {
            uuid
        }
    }

    fun String.toUndashedUuidString(): String {
        return this.replace("-", "")
    }
}