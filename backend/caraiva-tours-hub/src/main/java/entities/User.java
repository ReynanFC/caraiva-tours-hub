package entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name= "users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class User implements Serializable, UserDetails {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="user_id")
    @EqualsAndHashCode.Include
    private Long id;

    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="external_user_id", nullable = false)
    private UUID externalUserId;

    @Column(name="user_name", nullable = false, length = 50)
    private String userName;

    @Column(name="full_name", length = 100)
    private String fullName;

    @Column(name="email", length = 100, unique = true, nullable = false)
    private String email;

    @Column(name="password",  length = 255,  nullable = false)
    private String password;

    @Column(name="pix_key",  length = 255)
    private String pixKey;

    @Column(name="credentials_non_expired", nullable = false)
    private boolean credentialsNonExpired;

    @Column(name="enabled", nullable = false)
    private boolean enabled;

    @CreationTimestamp
    @Column(name="created_at", nullable = false)
    private LocalDateTime createdAt;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "_user_permission",
            joinColumns = {@JoinColumn (name = "user_id")},
            inverseJoinColumns = {@JoinColumn (name = "permission_id")}
    )
    private List<Permission> permission;

    public String getRole() {
        if (permission == null || permission.isEmpty()) {
            return null;
        }
        return permission.get(0).getRole().name();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.permission;
    }

    @Override
    public String getUsername() {
        return this.userName;
    }

    @Override
    public boolean isEnabled() {
        return this.enabled;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return this.credentialsNonExpired;
    }
}