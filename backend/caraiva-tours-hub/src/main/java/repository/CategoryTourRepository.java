package repository;

import entities.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryTourRepository extends JpaRepository<Booking, Long> {
}
