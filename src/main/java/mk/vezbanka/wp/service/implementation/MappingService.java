package mk.vezbanka.wp.service.implementation;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.*;
import mk.vezbanka.wp.model.Category;
import mk.vezbanka.wp.model.Game;
import mk.vezbanka.wp.model.User;
import mk.vezbanka.wp.model.request.AnswerRequest;
import mk.vezbanka.wp.model.request.QuestionRequest;
import mk.vezbanka.wp.model.response.CategoryResponse;
import mk.vezbanka.wp.model.response.GameResponse;
import mk.vezbanka.wp.model.response.UserResponse;
import org.springframework.stereotype.Service;

@Service
public class MappingService {

    public UserResponse mapToUserResponse(User user) {
        return new UserResponse(user.getId(), user.getUsername(), user.getFirstName(), user.getLastName(), user.getEmail(),
            user.getRoles().stream().map(role -> role.getName().toString()).collect(Collectors.toSet()),
            user.getPhoto() != null ? new String(user.getPhoto(), StandardCharsets.UTF_8) : null, user.getBiography(),
            user.getHeartedGames().stream().map(this::mapToGameResponse).collect(Collectors.toList()));
    }

    public GameResponse mapToGameResponse(Game game) {
        List<QuestionRequest> questions = game.getQuestions().stream().map(question -> {
            List<AnswerRequest> answers = question.getAnswers().stream().map(answer ->
                new AnswerRequest(answer.getAnswer(), answer.isCorrect(), answer.isSelected())).collect(
                Collectors.toList());
            return new QuestionRequest(question.getContent(), question.getPhoto() != null ? new String(question.getPhoto(), StandardCharsets.UTF_8) : null,
                question.getQuestionType().ordinal(), answers);
        }).collect(Collectors.toList());

        List<User> usersHearted = game.getUsersHearted();
        return new GameResponse(game.getId(), game.getName(), game.getNumberOfPlays(), game.getDateCreated(), game.getNumberOfHearts(),
            game.getPhoto() != null ? new String(game.getPhoto(), StandardCharsets.UTF_8) : null, game.getState().toString(), game.getShortDescription(), game.getCreator().getId(),
            questions, game.getCategories().stream().map(Category::getId).collect(Collectors.toList()),
            usersHearted != null ? usersHearted.stream().map(User::getId).collect(Collectors.toList()) : null);
    }

    public CategoryResponse mapToCategoryResponse(Category category) {
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
