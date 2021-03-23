package mk.vezbanka.wp.service.implementation;

import mk.vezbanka.wp.model.Category;
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
}
