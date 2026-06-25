package com.caraivatours.hub.auth.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;

@Component
public class JwtTokenFilter extends GenericFilterBean {

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenFilter.class);

    private final JwtTokenProvider tokenProvider;

    public JwtTokenFilter(JwtTokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;

        try {
            var tokenOptional = tokenProvider.resolveToken(httpRequest);

            tokenOptional
                    .filter(token -> tokenProvider.validateToken(token))
                    .ifPresent(token -> {
                        Authentication authentication = tokenProvider.getAuthenticationFromToken(token);

                        if (authentication != null) {
                            SecurityContextHolder.getContext().setAuthentication(authentication);
                            logger.debug("Security context set for request to {}", httpRequest.getRequestURI());
                        } else {
                            logger.warn("Token validated but produced null Authentication for request to {}", httpRequest.getRequestURI());
                        }
                    });
        } catch (Exception e) {
            logger.warn("Could not set authentication from token for request to {}: {}", httpRequest.getRequestURI(), e.getMessage());
            SecurityContextHolder.clearContext();
        }
        chain.doFilter(request, response);
    }
}