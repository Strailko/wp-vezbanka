package mk.vezbanka.wp.controller;

import java.util.List;
import mk.vezbanka.wp.model.Game;
import mk.vezbanka.wp.model.request.GameRequest;
import mk.vezbanka.wp.service.GameService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/game")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping("/{id}")
    public Game getGame(@PathVariable Long id) {
        return gameService.getGameById(id);
    }

    @GetMapping("/random")
    public Game getRandomGame() {
        return gameService.getRandomGame();
    }

    @GetMapping("/search/{query}")
    public List<Game> search(@PathVariable String query) {
        return gameService.searchGamesByName(query);
    }

    @GetMapping("/top-ranked")
    public List<Game> getTopRanked() {
        return gameService.getTopRankedGames();
    }

    @GetMapping("/latest")
    public List<Game> getLatestGames() {
        return gameService.getLatestGames();
    }

    @GetMapping("/top-played")
    public List<Game> getTopPlayed() {
        return gameService.getTopPlayedGames();
    }

    @GetMapping("/all")
    public List<Game> getAllGames() {
        return gameService.getAllGames();
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

    //TODO: Implement this method
    @PostMapping("/submit/{id}")
    public Double submitGame(@PathVariable Long id) {
        return null;
    }
}
