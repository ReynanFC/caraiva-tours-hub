package com.caraivatours.hub.auth.passwordreset;

import com.caraivatours.hub.auth.dto.ResetPasswordRequest;
import com.caraivatours.hub.mail.EmailService;
import com.caraivatours.hub.shared.exceptions.InvalidPasswordResetTokenException;
import com.caraivatours.hub.user.User;
import com.caraivatours.hub.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Optional;

/**
 * Implements password setup and password recovery with short-lived, one-use credentials.
 *
 * <p>The raw random token is delivered by e-mail, while Redis stores only its SHA-256 hash for
 * 15 minutes. Reset consumes the key atomically with {@code GETDEL}; consequently a token cannot
 * be replayed, even by two concurrent requests. Unknown e-mails are silently ignored to avoid
 * account enumeration.</p>
 */
@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final UserRepository userRepository;
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private final RedisTemplate<String, String> redisTemplate;
    private static final String KEY_PASSWORD_RESET = "password_reset:";
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    public void processResetRequest(String email) {
        issueToken(email, false);
    }

    public void processInitialPasswordSetup(String email) {
        issueToken(email, true);
    }

    private void issueToken(String email, boolean initialPasswordSetup) {

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) return;

        User user = userOpt.get();
        String token = generateToken();
        String tokenHash = hashToken(token);

        redisTemplate.opsForValue().set(
                KEY_PASSWORD_RESET + tokenHash,
                user.getId().toString(),
                Duration.ofMinutes(15)
        );

        if (initialPasswordSetup) {
            emailService.sendPasswordSetupEmail(user.getEmail(), token);
            return;
        }

        emailService.sendResetEmail(user.getEmail(), token);
    }

    /**
     * Consumes a reset token before persisting the new encoded password.
     * A missing user is reported as the same invalid-token error so internal account state is
     * not exposed.
     */
    public void resetPassword(ResetPasswordRequest request) {

        String tokenHash = hashToken(request.token());
        String redisKey = KEY_PASSWORD_RESET + tokenHash;

        String userId = redisTemplate.opsForValue().getAndDelete(redisKey);

        if (userId == null) {
            throw new InvalidPasswordResetTokenException("Invalid or expired password reset token");
        }

        Optional<User> userOpt = userRepository.findById(Long.parseLong(userId));

        if (userOpt.isEmpty()) {
            throw new InvalidPasswordResetTokenException("Invalid or expired password reset token");
        }

        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

    }

    private static String generateToken() {
        byte[] randomBytes = new byte[32];
        SECURE_RANDOM.nextBytes(randomBytes);

        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }

    private static String hashToken(String token) {
        try {
            byte[] hash = MessageDigest.getInstance("SHA-256")
                    .digest(token.getBytes(StandardCharsets.UTF_8));

            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is not available", exception);
        }
    }

}
