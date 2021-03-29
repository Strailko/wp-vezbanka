package mk.vezbanka.wp.repository;

import java.util.Optional;
import mk.vezbanka.wp.model.Role;
import mk.vezbanka.wp.model.enums.RoleEnum;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleEnum name);

}
