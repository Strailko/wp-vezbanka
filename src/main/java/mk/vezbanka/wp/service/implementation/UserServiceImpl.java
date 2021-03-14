package mk.vezbanka.wp.service.implementation;

import java.util.List;
import mk.vezbanka.wp.model.Game;
import mk.vezbanka.wp.model.User;
import mk.vezbanka.wp.repository.UserRepository;
import mk.vezbanka.wp.service.GameService;
import mk.vezbanka.wp.service.UserService;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final GameService gameService;

    public UserServiceImpl(UserRepository userRepository, GameService gameService) {
        this.userRepository = userRepository;
        this.gameService = gameService;
    }

    @Override
    public User getUser(Long id) {
        return userRepository.findById(id).orElseThrow(() ->
            new RuntimeException(String.format("User with id %d doesn't exist in the database", id)));
    }

    //TODO: Check if this saves the hearted game in the database
    @Override
    public void addGameToHeartedGames(Long userId, Long gameId) {
        Game game = gameService.getGameById(gameId);
        User user = getUser(userId);

        List<Game> heartedGames = user.getHeartedGames();
        heartedGames.add(game);

        gameService.updateNumberOfHearts(gameId);
        saveUser(user);
    }

    private User saveUser(User user) {
        return userRepository.save(user);
    }
}
