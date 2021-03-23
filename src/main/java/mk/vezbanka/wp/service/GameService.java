package mk.vezbanka.wp.service;

import java.util.List;
import mk.vezbanka.wp.model.Game;
import mk.vezbanka.wp.model.request.GameRequest;

public interface GameService {
    Game getRandomGame();

    Game getGameById(Long id);

    List<Game> searchGamesByName(String name);

    //void heartGame(Long gameId, Long userId);

    void updateNumberOfHearts(Long gameId);

    List<Game> getTopRankedGames();

    List<Game> getLatestGames();

    List<Game> getTopPlayedGames();

    List<Game> getAllGames();

    Game createGame(GameRequest request);

    Game editGame(Long gameId, GameRequest request);

    void deleteGame(Long id);

}
