package mk.vezbanka.wp.repository;

import mk.vezbanka.wp.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {

}
