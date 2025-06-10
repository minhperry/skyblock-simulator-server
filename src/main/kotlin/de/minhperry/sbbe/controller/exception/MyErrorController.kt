package de.minhperry.sbbe.controller.exception

import org.springframework.boot.web.servlet.error.ErrorController
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping

@Controller
class MyErrorController {

    @RequestMapping("/errdor")
    fun handleError(): ResponseEntity<ErrorResponse> {
        val error = ErrorResponse(
            message = "Route does not exist",
            code = ResponseLabel.ROUTE_NOT_EXIST
        )

        return ResponseEntity(error, HttpStatus.NOT_FOUND)
    }
}