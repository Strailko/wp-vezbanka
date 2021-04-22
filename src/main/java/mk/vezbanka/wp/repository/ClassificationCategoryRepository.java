package mk.vezbanka.wp.repository;

import mk.vezbanka.wp.model.ClassificationCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClassificationCategoryRepository extends JpaRepository<ClassificationCategory, Long> {
    ClassificationCategory findByName(String name);
}
