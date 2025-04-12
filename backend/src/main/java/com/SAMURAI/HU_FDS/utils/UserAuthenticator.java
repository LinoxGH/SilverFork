package com.SAMURAI.HU_FDS.utils;

import com.SAMURAI.HU_FDS.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

public class UserAuthenticator {

    @Autowired
    private JwtService jwtService;

    /**
     * Provides easy access for token authentication.
     * This way we do not have to rewrite this portion for every function.
     * This is also less prone to errors.
     *
     * @param header "Authorization" header (taken via <code>@RequestHeader("Authorization")</code>)
     * @return validation of the token
     */
    public boolean authenticate(String header) {
        String token = header.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        return jwtService.validateToken(token, userDetails);
    }

    private static UserAuthenticator instance;
    public static UserAuthenticator getInstance() {
        if (instance == null) instance = new UserAuthenticator();
        return instance;
    }
}
