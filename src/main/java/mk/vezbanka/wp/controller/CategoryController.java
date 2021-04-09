package mk.vezbanka.wp.controller;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.*;
import mk.vezbanka.wp.model.Category;
import mk.vezbanka.wp.model.User;
import mk.vezbanka.wp.model.request.AnswerRequest;
import mk.vezbanka.wp.model.request.QuestionRequest;
import mk.vezbanka.wp.model.response.CategoryResponse;
import mk.vezbanka.wp.model.response.GameResponse;
import mk.vezbanka.wp.service.CategoryService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/category")
@CrossOrigin("http://localhost:4200/")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("/{id}")
    public CategoryResponse getCategory(@PathVariable Long id) {
        Category category = categoryService.getCategoryById(id);
        return mapToCategoryResponse(category);
    }

    @GetMapping("/all")
    public List<CategoryResponse> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return categories.stream().map(this::mapToCategoryResponse).collect(Collectors.toList());
    }

    private CategoryResponse mapToCategoryResponse(Category category) {
        List<GameResponse> games = category.getGames().stream().map(
            game -> {
                List<QuestionRequest> questions = game.getQuestions().stream().map(question -> {
                    List<AnswerRequest> answers = question.getAnswers().stream().map(answer ->
                        new AnswerRequest(answer.getAnswer(), answer.isCorrect(), answer.isSelected())).collect(
                        Collectors.toList());
                    return new QuestionRequest(question.getContent(), question.getPhoto() != null ? new String(question.getPhoto(), StandardCharsets.UTF_8) : null,
                        question.getQuestionType().ordinal(), answers);
                }).collect(Collectors.toList());
                return new GameResponse(game.getId(), game.getName(), game.getNumberOfPlays(), game.getDateCreated(), game.getNumberOfHearts(),
                    game.getPhoto() != null ? new String(game.getPhoto(), StandardCharsets.UTF_8) : null, game.getState().toString(), game.getShortDescription(), game.getCreator().getId(),
                    questions, game.getCategories().stream().map(Category::getId).collect(Collectors.toList()),
                    game.getUsersHearted().stream().map(User::getId).collect(Collectors.toList()));
            }
        ).collect(Collectors.toList());
        return new CategoryResponse(category.getId(), category.getName(), category.getShortDescription(),
            category.getCoverPhoto() != null ? new String(category.getCoverPhoto(), StandardCharsets.UTF_8) : null, games);
    }
}
