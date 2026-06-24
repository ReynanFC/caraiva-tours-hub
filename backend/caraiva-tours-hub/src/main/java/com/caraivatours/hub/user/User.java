package com.caraivatours.hub.user;

import com.caraivatours.hub.auth.entity.enums.UserRole;
import com.caraivatours.hub.booking.Booking;
import com.caraivatours.hub.auth.entity.Permission;
import com.caraivatours.hub.statushistory.StatusHistory;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.*;

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

    @Column(name="password",  nullable = false)
    private String password;

    @Column(name="pix_key")
    private String pixKey;

    @Column(name="credentials_non_expired", nullable = false)
    private boolean credentialsNonExpired;

    @Column(name="enabled", nullable = false)
    private boolean enabled;

    @CreationTimestamp
    @Column(name="created_at", nullable = false)
    private LocalDateTime createdAt;

    @Setter(AccessLevel.NONE)
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_permission",
            joinColumns = {@JoinColumn (name = "user_id")},
            inverseJoinColumns = {@JoinColumn (name = "permission_id")}
    )
    private List<Permission> permission;

    @Setter(AccessLevel.NONE)
    @OneToMany(mappedBy = "attendant")
    private Set<Booking> bookings = new HashSet<>();

    @Setter(AccessLevel.NONE)
    @OneToMany(mappedBy = "user")
    private Set<StatusHistory> historyChange = new HashSet<>();


    public void addBooking(Booking booking) {
        this.bookings.add(booking);
        booking.setAttendant(this);
    }

    public void addHistoryChange(StatusHistory statusHistory) {
        historyChange.add(statusHistory);
        statusHistory.setUser(this);
    }


    public boolean isAdmin() {
        return this.getAuthorities().stream()
                .anyMatch(authority -> authority.equals(UserRole.ADMIN));
    }

    public void setRole(Permission role) {
        permission = new ArrayList<>();
        permission.add(role);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return permission;
    }

    @Override
    public String getUsername() {
        return userName;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return credentialsNonExpired;
    }
}