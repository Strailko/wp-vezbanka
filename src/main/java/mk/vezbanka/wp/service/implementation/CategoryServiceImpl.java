package mk.vezbanka.wp.service.implementation;

import java.nio.charset.StandardCharsets;
import java.util.List;
import javax.transaction.Transactional;
import mk.vezbanka.wp.model.Category;
import mk.vezbanka.wp.model.Game;
import mk.vezbanka.wp.model.request.CategoryRequest;
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

    private Category save(Category category) {
        return categoryRepository.save(category);
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

    @Override
    public Category create(CategoryRequest request) {
        Category category = new Category();
        setUpCategory(category, request);

        return save(category);
    }

    @Override
    public Category edit(Long categoryId, CategoryRequest request) {
        Category category = getCategoryById(categoryId);
        setUpCategory(category, request);
        return save(category);
    }

    @Transactional
    private void setUpCategory(Category category, CategoryRequest request) {
        category.setName(request.name);
        category.setShortDescription(request.shortDescription);
        category.setCoverPhoto(request.coverPhoto.getBytes(StandardCharsets.UTF_8));
    }
}
