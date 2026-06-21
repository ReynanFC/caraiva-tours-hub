package entities;

import jakarta.persistence.*;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

@Entity
@Table(name= "pickup_location")
public class PickupLocation implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name= "pickup_id")
    private Long id;

    private String cep;
    private String locationName;
    private String referencePoint;
    private BigDecimal appliedPickupFee = BigDecimal.ZERO;

    public PickupLocation() {}

    public PickupLocation(String cep, String locationName, String referencePoint, BigDecimal appliedPickupFee) {
        this.cep = cep;
        this.locationName = locationName;
        this.referencePoint = referencePoint;
        this.appliedPickupFee = appliedPickupFee;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCep() {
        return cep;
    }

    public void setCep(String cep) {
        this.cep = cep;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public String getReferencePoint() {
        return referencePoint;
    }

    public void setReferencePoint(String referencePoint) {
        this.referencePoint = referencePoint;
    }

    public BigDecimal getAppliedPickupFee() {
        return appliedPickupFee;
    }

    public void setAppliedPickupFee(BigDecimal appliedPickupFee) {
        this.appliedPickupFee = appliedPickupFee;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        PickupLocation that = (PickupLocation) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
