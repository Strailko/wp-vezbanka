package mk.vezbanka.wp.service;

import java.util.List;
import mk.vezbanka.wp.model.Category;
import mk.vezbanka.wp.model.Game;

public interface CategoryService {

    Category getCategoryById(Long id);

    List<Category> getAllCategories();

    List<Game> getGamesByCategory(Long id);

    void addGameToCategory(Long categoryId, Game game);
}
