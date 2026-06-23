package repository;

import entities.StatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StatusHistoryRepository extends JpaRepository<StatusHistory, Long> {
}
