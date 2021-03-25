package mk.vezbanka.wp.service;

import java.util.List;
import mk.vezbanka.wp.model.Game;
import mk.vezbanka.wp.model.User;
import mk.vezbanka.wp.model.request.UserRequest;

public interface UserService {
    User getUser(Long id);

    List<Game> getGamesCreatedByUser(Long id);

    boolean addGameToHeartedGames(Long userId, Long gameId);

    List<Game> getFavoriteGames(Long userId);

    List<User> getAllUsers();

    User changeRole(Long userId, String role);

    User register(UserRequest request);
}
