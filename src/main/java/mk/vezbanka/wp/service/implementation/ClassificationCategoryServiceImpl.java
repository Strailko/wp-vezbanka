package mk.vezbanka.wp.service.implementation;

import mk.vezbanka.wp.model.ClassificationCategory;
import mk.vezbanka.wp.repository.ClassificationCategoryRepository;
import mk.vezbanka.wp.service.ClassificationCategoryService;
import org.springframework.stereotype.Service;

@Service
public class ClassificationCategoryServiceImpl implements ClassificationCategoryService {
    private final ClassificationCategoryRepository repository;

    public ClassificationCategoryServiceImpl(ClassificationCategoryRepository repository) {
        this.repository = repository;
    }

    @Override
    public ClassificationCategory findById(Long id) {
        return repository.findById(id).orElseThrow(() ->
            new RuntimeException("Can't find classification category with id: " + id));
    }

    public void save(ClassificationCategory classificationCategory) {
        repository.save(classificationCategory);
    }

    @Override
    public ClassificationCategory findByName(String name) {
        return repository.findByName(name);
    }
}
