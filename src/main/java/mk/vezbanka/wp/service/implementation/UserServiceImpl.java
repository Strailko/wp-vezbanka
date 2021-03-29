package mk.vezbanka.wp.service.implementation;

import java.util.List;
import java.util.stream.*;
import javax.transaction.Transactional;
import mk.vezbanka.wp.model.Game;
import mk.vezbanka.wp.model.User;
import mk.vezbanka.wp.model.enums.Role;
import mk.vezbanka.wp.model.request.UserRequest;
import mk.vezbanka.wp.model.response.UserResponse;
import mk.vezbanka.wp.repository.UserRepository;
import mk.vezbanka.wp.service.GameService;
import mk.vezbanka.wp.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final GameService gameService;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, GameService gameService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.gameService = gameService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User getUser(Long id) {
        return userRepository.findById(id).orElseThrow(() ->
            new RuntimeException(String.format("User with id %d doesn't exist in the database", id)));
    }

    @Override
    public List<Game> getGamesCreatedByUser(Long id) {
        return gameService.getAllGames().stream().filter(game -> game.getCreator().getId().equals(id)).collect(
            Collectors.toList());
    }

    @Override
    public boolean addGameToHeartedGames(Long userId, Long gameId) {
        Game game = gameService.getGameById(gameId);
        User user = getUser(userId);

        List<Game> heartedGames = user.getHeartedGames();
        // Check if game has already been hearted, if yes, unheart it and return false, else heart it and return true
        if (heartedGames.stream().filter(el -> el.getId().equals(gameId)).count() != 0) {
            heartedGames.remove(game);
            gameService.decreaseNumberOfHearts(gameId);
            saveUser(user);
            return false;
        } else {
            heartedGames.add(game);
            gameService.increaseNumberOfHearts(gameId);
            saveUser(user);
            return true;
        }
    }

    @Override
    public List<Game> getFavoriteGames(Long userId) {
        User user = getUser(userId);

        return user.getHeartedGames();
    }

    @Override
    public List<User> getAllUsers() {
        return this.userRepository.findAll();
    }

    @Override
    public User changeRole(Long userId, String role) {
        User user = getUser(userId);

        switch (role) {
            case "ADMIN":
                user.setRole(Role.ADMIN);
                break;
            case "MODERATOR":
                user.setRole(Role.MODERATOR);
                break;
            case "REGULAR":
                user.setRole(Role.REGULAR);
                break;
            default:
                throw new RuntimeException(String.format("Role with name %s doesn't exist", role));
        }

        return saveUser(user);
    }

    @Override
    @Transactional
    public User register(UserRequest request) {
        User user = new User();

        user.setRole(Role.REGULAR);
        user.setUsername(request.username);
        user.setPassword(passwordEncoder.encode(request.password));
        user.setEmail(request.email);
        user.setFirstName(request.firstName);
        user.setLastName(request.lastName);

        if (request.biography != null) {
            user.setBiography(request.biography);
        }

        if (request.photo != null) {
            user.setPhoto(request.photo);
        }

        return saveUser(user);
    }
    //
    //@Override
    //public UserResponse login(String username, String password) {
    //
    //}

    private User saveUser(User user) {
        return userRepository.save(user);
    }
}
