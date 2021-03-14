package mk.vezbanka.wp.service.implementation;

import java.util.List;
import java.util.Random;
import java.util.stream.*;
import mk.vezbanka.wp.model.Game;
import mk.vezbanka.wp.repository.GameRepository;
import mk.vezbanka.wp.service.GameService;
import mk.vezbanka.wp.service.UserService;
import org.springframework.stereotype.Service;

@Service
public class GameServiceImpl implements GameService {

    private final GameRepository gameRepository;

    public GameServiceImpl(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    @Override
    public Game getRandomGame() {
        List<Game> games = gameRepository.findAll();
        List<Long> gameIds = games.stream().map(Game::getId).collect(Collectors.toList());
        Random random = new Random();
        Long randomGameId = gameIds.get(random.nextInt(gameIds.size()));
        return getGameById(randomGameId);
    }

    @Override
    public Game getGameById(Long id) {
        return gameRepository.findById(id).orElseThrow(() ->
            new RuntimeException(String.format("Game with id %d doesn't exist in the database", id)));
    }

    @Override
    public List<Game> searchGamesByName(String name) {
        return gameRepository.findAllByNameLike(name);
    }

    //@Override
    //public void heartGame(Long gameId, Long userId) {
    //    Game game = getGameById(gameId);
    //    User user = userService.getUser(userId);
    //
    //    user.
    //}

    @Override
    public void updateNumberOfHearts(Long gameId) {
        Game game = getGameById(gameId);
        game.setNumberOfHearts(game.getNumberOfHearts()+1);

        save(game);
    }

    @Override
    public List<Game> getTopRankedGames() {
        return gameRepository.findByOrderByNumberOfHeartsDesc()
            .stream().limit(10)
            .collect(Collectors.toList());
    }

    @Override
    public List<Game> getLatestGames() {
        return gameRepository.findByOrderByDateCreatedDesc()
            .stream().limit(10)
            .collect(Collectors.toList());
    }

    @Override
    public List<Game> getTopPlayedGames() {
        return gameRepository.findByOrderByNumberOfPlaysDesc()
            .stream().limit(10)
            .collect(Collectors.toList());    }

    @Override
    public List<Game> getAllGames() {
        return gameRepository.findAll();
    }

    @Override
    public void deleteGame(Long id) {
        Game game = getGameById(id);
        gameRepository.delete(game);
    }

    private void save(Game game) {
        gameRepository.save(game);
    }
}
