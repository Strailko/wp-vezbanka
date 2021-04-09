package mk.vezbanka.wp.controller;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.*;
import mk.vezbanka.wp.model.Category;
import mk.vezbanka.wp.model.Game;
import mk.vezbanka.wp.model.User;
import mk.vezbanka.wp.model.request.AnswerRequest;
import mk.vezbanka.wp.model.request.GameRequest;
import mk.vezbanka.wp.model.request.QuestionRequest;
import mk.vezbanka.wp.model.response.GameResponse;
import mk.vezbanka.wp.service.GameService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/game")
@CrossOrigin("http://localhost:4200/")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping("/{id}")
    public GameResponse getGame(@PathVariable Long id) {
        Game game = gameService.getGameById(id);
        return mapToGameResponse(game);
    }

    @GetMapping("/random")
    public GameResponse getRandomGame() {
        Game game = gameService.getRandomGame();
        return mapToGameResponse(game);
    }

    @GetMapping("/search/{query}")
    public List<GameResponse> search(@PathVariable String query) {
        List<Game> games = gameService.searchGamesByName(query);
        return games.stream().map(this::mapToGameResponse).collect(Collectors.toList());
    }

    @GetMapping("/top-ranked")
    public List<GameResponse> getTopRanked() {
        List<Game> games = gameService.getTopRankedGames();
        return games.stream().map(this::mapToGameResponse).collect(Collectors.toList());
    }

    @GetMapping("/latest")
    public List<GameResponse> getLatestGames() {
        List<Game> games = gameService.getLatestGames();
        return games.stream().map(this::mapToGameResponse).collect(Collectors.toList());
    }

    @GetMapping("/top-played")
    public List<GameResponse> getTopPlayed() {
        List<Game> games = gameService.getTopPlayedGames();
        return games.stream().map(this::mapToGameResponse).collect(Collectors.toList());
    }

    @GetMapping("/all")
    public List<GameResponse> getAllGames() {
        List<Game> games = gameService.getAllGames();
        return games.stream().map(this::mapToGameResponse).collect(Collectors.toList());
    }

    @PostMapping("/create")
    public Game createGame(@RequestBody GameRequest request) {
        return gameService.createGame(request);
    }

    @PostMapping("/edit/{id}")
    public Game editGame(@PathVariable Long id, @RequestBody GameRequest request) {
        return gameService.editGame(id, request);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteGame(@PathVariable Long id) {
        gameService.deleteGame(id);
    }

    @PostMapping("/submit/{id}")
    public float submitGame(@PathVariable Long id, @RequestBody Game game) {
        return gameService.submitGame(id, game);
    }

    private GameResponse mapToGameResponse(Game game) {
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
}
