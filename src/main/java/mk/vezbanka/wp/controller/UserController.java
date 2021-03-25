package mk.vezbanka.wp.controller;

import java.util.List;
import mk.vezbanka.wp.model.Game;
import mk.vezbanka.wp.model.User;
import mk.vezbanka.wp.model.request.ChangeRoleRequest;
import mk.vezbanka.wp.model.request.HeartedGameRequest;
import mk.vezbanka.wp.model.request.UserRequest;
import mk.vezbanka.wp.service.GameService;
import mk.vezbanka.wp.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService, GameService gameService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public User getProfile(@PathVariable Long id) {
        return userService.getUser(id);
    }

    @GetMapping("/games/{id}")
    public List<Game> getGamesCreatedByUser(@PathVariable Long id) {
        return userService.getGamesCreatedByUser(id);
    }

    @PostMapping("/heart")
    public boolean heartGame(@RequestBody HeartedGameRequest request) {
        return this.userService.addGameToHeartedGames(request.userId, request.gameId);
    }

    @GetMapping("/favorites/{userId}")
    public List<Game> getFavouriteGames(@PathVariable Long userId) {
        return this.userService.getFavoriteGames(userId);
    }

    @GetMapping("/all")
    public List<User> getAllUsers() {
        return this.userService.getAllUsers();
    }

    @PutMapping("/{userId}/change-role")
    public User changeRole(@PathVariable Long userId, @RequestBody ChangeRoleRequest request) {
        return userService.changeRole(userId, request.role);
    }

    @PostMapping("/register")
    public User register(@RequestBody UserRequest request) {
        return userService.register(request);
    }
}
