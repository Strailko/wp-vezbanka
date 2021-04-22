package mk.vezbanka.wp.service;

import mk.vezbanka.wp.model.ClassificationCategory;

public interface ClassificationCategoryService {
    ClassificationCategory findById(Long id);
    ClassificationCategory findByName(String name);
}
