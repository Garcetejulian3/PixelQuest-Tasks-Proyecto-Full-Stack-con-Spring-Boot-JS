package com.task_api.api_task_mini.service;

import java.security.Key;
import java.util.Date;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private static final String SECRET_KEY = "xgwiJdkvezIM6AEKV1zdifTnYvswv6fHCLKcVHlYYCg=";

    // GENERADOR de token para el usuario
    public String getToken(UserDetails user){
        return Jwts.builder()
            .setSubject(user.getUsername()) // pa guardar el username
            .setIssuedAt(new Date())        // fecha de creacion
            .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 24 hs
            .signWith(getKey(),SignatureAlgorithm.HS256) // firma de clave secreta
            .compact();
    }

    // EXTRAE el username de un token
    public String getUsernameFromToken(String token){
        Claims claims = Jwts.parserBuilder()
            .setSigningKey(getKey())
            .build()
            .parseClaimsJws(token)
            .getBody();
        return claims.getSubject();
    }

    // VALIDA si un token es correcto
    public boolean isTokenValid(String token,UserDetails userDetails){
        String username = getUsernameFromToken(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    // VERIFICA si expiro
    private boolean isTokenExpired(String token) {
        return getExpiration(token).before(new Date());
    }

    // OBTENER la fecha de expiracion del token
    private Date getExpiration(String token) {
        Claims claims = Jwts.parserBuilder()
            .setSigningKey(getKey())
            .build()
            .parseClaimsJws(token)
            .getBody();
        return claims.getExpiration();
    }

    // TRANSFORMA mi secret key a tipo KEY
    private Key getKey() {
        byte[] KeyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(KeyBytes);
    }




}
