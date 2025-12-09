package com.task_api.api_task_mini.jwt;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.task_api.api_task_mini.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter{

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)throws ServletException, IOException {
        
                // OBTENER el token del header Authorization
                String token = getTokenFromRequest(request);

                // SI NO HAY token continuar rutas publicas
                if (token == null){
                    filterChain.doFilter(request, response);
                    return;
                }

                try {
                    // EXTRAER username del token
                    String username = jwtService.getUsernameFromToken(token);

                    // SI HAY username y no esta autenticado aun 
                    if (username != null && SecurityContextHolder.getContext().getAuthentication() == null){
                        // CARGAR los datos del usuario 
                        UserDetails userdetails = userDetailsService.loadUserByUsername(username);

                        // VALIDAR el token 
                        if(jwtService.isTokenValid(token, userdetails)){
                            // CREAR objeto de autenticacion 
                            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                userdetails,
                                null,
                                userdetails.getAuthorities()
                            );

                            // ESTABLECER detalles adicionales 
                            authToken.setDetails(
                                new WebAuthenticationDetailsSource().buildDetails(request)
                            );
                            // ESTABLECER en el contexto de seguridad
                            SecurityContextHolder.getContext().setAuthentication(authToken);
                        }
                    }
                } catch (Exception e) {
                    // Token inválido, continuar sin autenticar
                }

                // 10. Continuar con la cadena de filtros
                filterChain.doFilter(request, response);
    }


    private String getTokenFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7); // Quita "Bearer "
        }
        return null;
    }
}
