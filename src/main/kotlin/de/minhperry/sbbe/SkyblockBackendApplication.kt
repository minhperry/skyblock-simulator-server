package de.minhperry.sbbe

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.cache.annotation.EnableCaching

@SpringBootApplication
@EnableCaching
class SkyblockBackendApplication
// TODO: with ttl https://www.baeldung.com/spring-setting-ttl-value-cache

fun main(args: Array<String>) {
	runApplication<SkyblockBackendApplication>(*args)
}
