package mk.vezbanka.wp.controller;

import java.util.List;
import java.util.stream.*;
import mk.vezbanka.wp.model.Category;
import mk.vezbanka.wp.model.request.CategoryRequest;
import mk.vezbanka.wp.model.response.CategoryResponse;
import mk.vezbanka.wp.service.CategoryService;
import mk.vezbanka.wp.service.implementation.MappingService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/category")
@CrossOrigin("http://localhost:4200/")
public class CategoryController {

    private final CategoryService categoryService;
    private final MappingService mappingService;

    public CategoryController(CategoryService categoryService,
                              MappingService mappingService) {
        this.categoryService = categoryService;
        this.mappingService = mappingService;
    }

    @GetMapping("/{id}")
    public CategoryResponse getCategory(@PathVariable Long id) {
        Category category = categoryService.getCategoryById(id);
        return mappingService.mapToCategoryResponse(category);
    }

    @GetMapping("/all")
    public List<CategoryResponse> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return categories.stream().map(mappingService::mapToCategoryResponse).collect(Collectors.toList());
    }

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MODERATOR')")
    public CategoryResponse createNewCategory(@RequestBody CategoryRequest request) {
        Category category = categoryService.create(request);
        return mappingService.mapToCategoryResponse(category);
    }

    @PostMapping("/edit/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MODERATOR')")
    public CategoryResponse editCategory(@PathVariable Long id, @RequestBody CategoryRequest request) {
        Category category = categoryService.edit(id, request);
        return mappingService.mapToCategoryResponse(category);
    }
}
