package mk.vezbanka.wp.service;

import java.util.List;
import mk.vezbanka.wp.model.Category;
import mk.vezbanka.wp.model.Game;
import mk.vezbanka.wp.model.request.CategoryRequest;

public interface CategoryService {

    Category create(CategoryRequest request);

    Category edit(Long categoryId, CategoryRequest request);

    Category getCategoryById(Long id);

    List<Category> getAllCategories();

    List<Game> getGamesByCategory(Long id);

    void addGameToCategory(Long categoryId, Game game);

    void removeGameFromCategory(Long categoryId, Game game);
}
