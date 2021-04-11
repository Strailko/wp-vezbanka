package mk.vezbanka.wp.service.implementation;

import java.nio.charset.StandardCharsets;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.*;
import javax.transaction.Transactional;
import mk.vezbanka.wp.model.Game;
import mk.vezbanka.wp.model.Role;
import mk.vezbanka.wp.model.User;
import mk.vezbanka.wp.model.UserDetailsImpl;
import mk.vezbanka.wp.model.enums.RoleEnum;
import mk.vezbanka.wp.model.request.UserRequest;
import mk.vezbanka.wp.repository.RoleRepository;
import mk.vezbanka.wp.repository.UserRepository;
import mk.vezbanka.wp.service.GameService;
import mk.vezbanka.wp.service.UserService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class UserServiceImpl implements UserService, UserDetailsService {

    private final UserRepository userRepository;
    private final GameService gameService;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;


    public UserServiceImpl(UserRepository userRepository, GameService gameService, PasswordEncoder passwordEncoder,
                           RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.gameService = gameService;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
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

        Set<Role> roles = new HashSet<>();

        switch (role) {
            case "ADMIN":
                roles.add(roleRepository.findByName(RoleEnum.ADMIN).get());
                user.setRoles(roles);
                break;
            case "MODERATOR":
                roles.add(roleRepository.findByName(RoleEnum.MODERATOR).get());
                user.setRoles(roles);
                break;
            case "REGULAR":
                roles.add(roleRepository.findByName(RoleEnum.REGULAR).get());
                user.setRoles(roles);
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

        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName(RoleEnum.REGULAR)
            .orElseThrow(() -> new RuntimeException("Error: Role REGULAR not found."));
        roles.add(userRole);
        user.setRoles(roles);

        setUpUser(user, request);

        return saveUser(user);
    }

    public User editUser(Long userId, UserRequest request) {
        User user = getUser(userId);
        setUpUser(user, request);
        return user;
    }

    @Transactional
    private void setUpUser(User user, UserRequest request) {
        user.setUsername(request.username);
        user.setPassword(passwordEncoder.encode(request.password));
        user.setEmail(request.email);
        user.setFirstName(request.firstName);
        user.setLastName(request.lastName);

        if (request.biography != null) {
            user.setBiography(request.biography);
        }

        if (request.photo != null) {
            user.setPhoto(request.photo.getBytes(StandardCharsets.UTF_8));
        }
    }

    private User saveUser(User user) {
        return userRepository.save(user);
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException(String.format("User with username %s not found", username)));

        return UserDetailsImpl.build(user);
    }

    public void changePassword(Long userId, String newPassword) {
        User user = getUser(userId);
        if (newPassword == null)
            throw new RuntimeException("Password cannot be null");
        user.setPassword(passwordEncoder.encode(newPassword));

    }
}
