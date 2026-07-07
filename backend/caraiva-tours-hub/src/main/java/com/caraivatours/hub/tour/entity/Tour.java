package com.caraivatours.hub.tour.entity;

import com.caraivatours.hub.category.CategoryTour;
import com.caraivatours.hub.tour.entity.enums.CommissionType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;

@Entity
@Table(name="tour")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Tour implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tour_id")
    @EqualsAndHashCode.Include
    private Long id;

    @Column(name = "name", nullable = false, unique = true, length = 150)
    private String name;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "base_price_per_person", nullable = false, precision = 10, scale = 2)
    private BigDecimal basePricePerPerson;

    @Column(name = "promo_price_per_person", precision = 10, scale = 2)
    private BigDecimal promoPricePerPerson;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "commission_type", nullable = false)
    private CommissionType commissionType;

    @Column(name = "commission_value", precision = 10, scale = 2, nullable = false)
    private BigDecimal commissionValue;

    @Column(name = "duration", nullable = false)
    @JdbcTypeCode(SqlTypes.INTERVAL_SECOND)
    private Duration duration;

    @Column(name = "available", nullable = false)
    private boolean available;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "is_promotional")
    private boolean isPromotional;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private CategoryTour categoryTour;

    public BigDecimal getEffectivePrice() {
        return isPromotional ? promoPricePerPerson : basePricePerPerson;
    }

    public BigDecimal calculateCommissionPerPerson(BigDecimal unitPrice) {

        if (commissionType == CommissionType.PERCENTAGE) {
            return unitPrice.multiply(commissionValue)
                    .divide(new BigDecimal("100"), 10, RoundingMode.HALF_UP);
        }
        return commissionValue;
    }
}