package mk.vezbanka.wp.service;

import mk.vezbanka.wp.model.User;

public interface UserService {
    User getUser(Long id);

    void addGameToHeartedGames(Long userId, Long gameId);
}
