package mk.vezbanka.wp.controller;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.*;
import mk.vezbanka.wp.model.Game;
import mk.vezbanka.wp.model.request.GameRequest;
import mk.vezbanka.wp.model.response.GameResponse;
import mk.vezbanka.wp.service.GameService;
import mk.vezbanka.wp.service.implementation.MappingService;
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
    private final MappingService mappingService;

    public GameController(GameService gameService,
                          MappingService mappingService) {
        this.gameService = gameService;
        this.mappingService = mappingService;
    }

    @GetMapping("/{id}")
    public GameResponse getGame(@PathVariable Long id) {
        Game game = gameService.getGameById(id);
        return mappingService.mapToGameResponse(game);
    }

    @GetMapping("/random")
    public GameResponse getRandomGame() {
        Game game = gameService.getRandomGame();
        return mappingService.mapToGameResponse(game);
    }

    @GetMapping("/search/{query}")
    public List<GameResponse> search(@PathVariable String query) {
        List<Game> games = gameService.searchGamesByName(query);
        return games.stream().map(mappingService::mapToGameResponse).collect(Collectors.toList());
    }

    @GetMapping("/top-ranked")
    public List<GameResponse> getTopRanked() {
        List<Game> games = gameService.getTopRankedGames();
        return games.stream().map(mappingService::mapToGameResponse).collect(Collectors.toList());
    }

    @GetMapping("/latest")
    public List<GameResponse> getLatestGames() {
        List<Game> games = gameService.getLatestGames();
        return games.stream().map(mappingService::mapToGameResponse).collect(Collectors.toList());
    }

    @GetMapping("/top-played")
    public List<GameResponse> getTopPlayed() {
        List<Game> games = gameService.getTopPlayedGames();
        return games.stream().map(mappingService::mapToGameResponse).collect(Collectors.toList());
    }

    @GetMapping("/all")
    public List<GameResponse> getAllGames() {
        List<Game> games = gameService.getAllGames();
        return games.stream().map(mappingService::mapToGameResponse).collect(Collectors.toList());
    }

    @PostMapping("/create")
    public GameResponse createGame(@RequestBody GameRequest request) {
        return mappingService.mapToGameResponse(gameService.createGame(request));
    }

    @PostMapping("/edit/{id}")
    public GameResponse editGame(@PathVariable Long id, @RequestBody GameRequest request) {
        return mappingService.mapToGameResponse(gameService.editGame(id, request));
    }

    @DeleteMapping("/delete/{id}")
    public void deleteGame(@PathVariable Long id) {
        gameService.deleteGame(id);
    }

    @PostMapping("/submit/{id}")
    public float submitGame(@PathVariable Long id, @RequestBody GameRequest game) {
        return gameService.submitGame(id, game);
    }

}
