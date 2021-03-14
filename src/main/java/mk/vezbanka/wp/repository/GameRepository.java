package mk.vezbanka.wp.repository;

import java.util.List;
import mk.vezbanka.wp.model.Game;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {
    List<Game> findAllByNameLike(String name);

    List<Game> findByOrderByNumberOfHeartsDesc();

    List<Game> findByOrderByNumberOfPlaysDesc();

    List<Game> findByOrderByDateCreatedDesc();
}
