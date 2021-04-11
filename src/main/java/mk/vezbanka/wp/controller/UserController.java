package mk.vezbanka.wp.controller;

import java.util.List;
import java.util.stream.*;
import mk.vezbanka.wp.config.JwtUtils;
import mk.vezbanka.wp.model.Game;
import mk.vezbanka.wp.model.User;
import mk.vezbanka.wp.model.UserDetailsImpl;
import mk.vezbanka.wp.model.request.ChangePasswordRequest;
import mk.vezbanka.wp.model.request.ChangeRoleRequest;
import mk.vezbanka.wp.model.request.HeartedGameRequest;
import mk.vezbanka.wp.model.request.UserRequest;
import mk.vezbanka.wp.model.response.GameResponse;
import mk.vezbanka.wp.model.response.JwtResponse;
import mk.vezbanka.wp.model.response.MessageResponse;
import mk.vezbanka.wp.model.response.UserResponse;
import mk.vezbanka.wp.repository.UserRepository;
import mk.vezbanka.wp.service.UserService;
import mk.vezbanka.wp.service.implementation.MappingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private final MappingService mappingService;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    public UserController(UserService userService,
                          MappingService mappingService,
                          AuthenticationManager authenticationManager,
                          UserRepository userRepository,
                          PasswordEncoder encoder, JwtUtils jwtUtils) {
        this.userService = userService;
        this.mappingService = mappingService;
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.jwtUtils = jwtUtils;
    }

    @GetMapping("/{id}")
    public UserResponse getProfile(@PathVariable Long id) {
        User user = userService.getUser(id);
        return mappingService.mapToUserResponse(user);
    }

    @GetMapping("/games/{id}")
    public List<GameResponse> getGamesCreatedByUser(@PathVariable Long id) {
        List<Game> games = userService.getGamesCreatedByUser(id);
        return games.stream().map(mappingService::mapToGameResponse).collect(Collectors.toList());
    }

    @PostMapping("/heart")
    public boolean heartGame(@RequestBody HeartedGameRequest request) {
        return this.userService.addGameToHeartedGames(request.userId, request.gameId);
    }

    @GetMapping("/favorites/{userId}")
    public List<GameResponse> getFavouriteGames(@PathVariable Long userId) {
        List<Game> games = userService.getFavoriteGames(userId);
        return games.stream().map(mappingService::mapToGameResponse).collect(Collectors.toList());
    }

    @GetMapping("/all")
    public List<UserResponse> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return users.stream().map(mappingService::mapToUserResponse).collect(Collectors.toList());
    }

    @PutMapping("/{userId}/change-role")
    public UserResponse changeRole(@PathVariable Long userId, @RequestBody ChangeRoleRequest request) {
        User user = userService.changeRole(userId, request.role);
        return mappingService.mapToUserResponse(user);
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

    @PostMapping("/edit/{id}")
    public ResponseEntity<?> editUser(@PathVariable Long id, @RequestBody UserRequest request) {
        try {
            userService.editUser(id, request);
            return ResponseEntity.ok(new MessageResponse("User edited successfully!"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error editing the user"));
        }
    }

    @PostMapping("/change-password/{id}")
    public ResponseEntity<?> changePassword(@PathVariable Long id, @RequestBody ChangePasswordRequest request) {
        try {
            userService.changePassword(id, request.newPassword);
            return ResponseEntity.ok(new MessageResponse("Password changed successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error changing password"));
        }
    }
}
