package com.SAMURAI.HU_FDS.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Base64;



@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginDto {
    private String token;
    private String username;
    private String email;
    private String rank;
    private String picture;

    public LoginDto(String token, String username,String email, String rank, byte[] picture) {
            this.token = token;
            this.username = username;
            this.email = email;
            this.rank = rank;
            this.picture = picture != null ? Base64.getEncoder().encodeToString(picture) : null;
    }
}

