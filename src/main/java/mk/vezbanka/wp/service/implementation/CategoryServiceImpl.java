package mk.vezbanka.wp.service.implementation;

import java.util.List;
import mk.vezbanka.wp.model.Category;
import mk.vezbanka.wp.model.Game;
import mk.vezbanka.wp.repository.CategoryRepository;
import mk.vezbanka.wp.service.CategoryService;
import org.springframework.stereotype.Service;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id).orElseThrow(() ->
            new RuntimeException("Can't find category with id: " + id));
    }

    private void save(Category category) {
        categoryRepository.save(category);
    }

    @Override
    public void addGameToCategory(Long categoryId, Game game) {
        Category category = getCategoryById(categoryId);

        category.getGames().add(game);

        save(category);
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public List<Game> getGamesByCategory(Long id) {
        Category category = getCategoryById(id);
        return category.getGames();
    }
}
