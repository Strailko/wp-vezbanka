package mk.vezbanka.wp.controller;

import java.util.List;
import java.util.stream.*;
import mk.vezbanka.wp.config.JwtUtils;
import mk.vezbanka.wp.model.Game;
import mk.vezbanka.wp.model.User;
import mk.vezbanka.wp.model.UserDetailsImpl;
import mk.vezbanka.wp.model.request.ChangeRoleRequest;
import mk.vezbanka.wp.model.request.HeartedGameRequest;
import mk.vezbanka.wp.model.request.UserRequest;
import mk.vezbanka.wp.model.response.JwtResponse;
import mk.vezbanka.wp.model.response.MessageResponse;
import mk.vezbanka.wp.repository.UserRepository;
import mk.vezbanka.wp.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping(value = "/api/user")
@CrossOrigin("http://localhost:4200/")
public class UserController {

    private final UserService userService;

    AuthenticationManager authenticationManager;

    UserRepository userRepository;

    PasswordEncoder encoder;

    JwtUtils jwtUtils;

    public UserController(UserService userService,
                          AuthenticationManager authenticationManager,
                          UserRepository userRepository,
                          PasswordEncoder encoder, JwtUtils jwtUtils) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.jwtUtils = jwtUtils;
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
    public ResponseEntity<?> register(@RequestBody UserRequest request) {
        if (userRepository.existsByUsername(request.username)) {
            return ResponseEntity
                .badRequest()
                .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(request.email)) {
            return ResponseEntity
                .badRequest()
                .body(new MessageResponse("Error: Email is already in use!"));
        }

        try {
            userService.register(request);
            return ResponseEntity.ok(new MessageResponse("User registered successfully!"));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error registering a user"));
        }
    }


    @PostMapping("/login")
    public JwtResponse login(@RequestBody UserRequest request)
    {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.username, request.password));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.toList());

        return new JwtResponse(jwt,
            userDetails.getId(),
            userDetails.getUsername(),
            userDetails.getEmail(),
            roles);
    }


}
