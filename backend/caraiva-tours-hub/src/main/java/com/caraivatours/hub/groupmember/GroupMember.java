package com.caraivatours.hub.groupmember;

import com.caraivatours.hub.booking.Booking;
import jakarta.persistence.*;

import java.io.Serial;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name="group_member")
public class GroupMember implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="group_id")
    private Long id;

    @Column(name="name", nullable = false, length = 100)
    private String name;

    @Column(name="is_lap_child", nullable = false)
    private boolean isLapChild;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id",  nullable = false)
    private Booking booking;

    public GroupMember() {}

    public GroupMember(String name, boolean isLapChild) {
        this.name = name;
        this.isLapChild = isLapChild;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isLapChild() {
        return isLapChild;
    }

    public void setLapChild(boolean lapChild) {
        isLapChild = lapChild;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        GroupMember that = (GroupMember) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
