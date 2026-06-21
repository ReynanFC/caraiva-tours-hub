package entities;

import jakarta.persistence.*;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Table(name = "pickup_location")
public class PickupLocation implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pickup_id")
    private Long id;

    @Column(name = "cep", length = 9)
    private String cep;

    @Column(name = "location_name", nullable = false, length = 150)
    private String locationName;

    @Column(name = "reference_point", length = 255)
    private String referencePoint;

    @Column(name = "applied_pickup_fee", nullable = false, precision = 10, scale = 2)
    private BigDecimal appliedPickupFee = BigDecimal.ZERO;

    public PickupLocation() {}

    public PickupLocation(String cep, String locationName, String referencePoint, BigDecimal appliedPickupFee) {
        this.cep = cep;
        this.locationName = locationName;
        this.referencePoint = referencePoint;
        this.appliedPickupFee = appliedPickupFee != null ? appliedPickupFee : BigDecimal.ZERO;
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
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PickupLocation that = (PickupLocation) o;
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}