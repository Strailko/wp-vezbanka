package mk.vezbanka.wp.service;

import java.util.List;
import mk.vezbanka.wp.model.Game;
import mk.vezbanka.wp.model.Question;

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

    //Long createGame(String name, String photo, String shortDescription,
    //                Long userId, List<Question> questions, List<Long> categories);
    //
    //Game editGame(Long gameId);

    void deleteGame(Long id);

}
