package mk.vezbanka.wp.controller;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.*;
import mk.vezbanka.wp.config.JwtUtils;
import mk.vezbanka.wp.model.Category;
import mk.vezbanka.wp.model.Game;
import mk.vezbanka.wp.model.User;
import mk.vezbanka.wp.model.UserDetailsImpl;
import mk.vezbanka.wp.model.request.AnswerRequest;
import mk.vezbanka.wp.model.request.ChangeRoleRequest;
import mk.vezbanka.wp.model.request.HeartedGameRequest;
import mk.vezbanka.wp.model.request.QuestionRequest;
import mk.vezbanka.wp.model.request.UserRequest;
import mk.vezbanka.wp.model.response.GameResponse;
import mk.vezbanka.wp.model.response.JwtResponse;
import mk.vezbanka.wp.model.response.MessageResponse;
import mk.vezbanka.wp.model.response.UserResponse;
import mk.vezbanka.wp.repository.UserRepository;
import mk.vezbanka.wp.service.UserService;
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
    public UserResponse getProfile(@PathVariable Long id) {
        User user = userService.getUser(id);
        return mapToUserResponse(user);
    }

    @GetMapping("/games/{id}")
    public List<GameResponse> getGamesCreatedByUser(@PathVariable Long id) {
        List<Game> games = userService.getGamesCreatedByUser(id);
        return games.stream().map(this::mapToGameResponse).collect(Collectors.toList());
    }

    @PostMapping("/heart")
    public boolean heartGame(@RequestBody HeartedGameRequest request) {
        return this.userService.addGameToHeartedGames(request.userId, request.gameId);
    }

    @GetMapping("/favorites/{userId}")
    public List<GameResponse> getFavouriteGames(@PathVariable Long userId) {
        List<Game> games = userService.getFavoriteGames(userId);
        return games.stream().map(this::mapToGameResponse).collect(Collectors.toList());
    }

    @GetMapping("/all")
    public List<UserResponse> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return users.stream().map(this::mapToUserResponse).collect(Collectors.toList());
    }

    @PutMapping("/{userId}/change-role")
    public UserResponse changeRole(@PathVariable Long userId, @RequestBody ChangeRoleRequest request) {
        User user = userService.changeRole(userId, request.role);
        return mapToUserResponse(user);
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

    public UserResponse mapToUserResponse(User user) {
        return new UserResponse(user.getId(), user.getUsername(), user.getFirstName(), user.getLastName(), user.getEmail(),
            user.getRoles().stream().map(role -> role.getName().toString()).collect(Collectors.toSet()),
            user.getPhoto() != null ? new String(user.getPhoto(), StandardCharsets.UTF_8) : null, user.getBiography(),
            user.getHeartedGames().stream().map(this::mapToGameResponse).collect(Collectors.toList()));
    }

    private GameResponse mapToGameResponse(Game game) {
        List<QuestionRequest> questions = game.getQuestions().stream().map(question -> {
            List<AnswerRequest> answers = question.getAnswers().stream().map(answer ->
                new AnswerRequest(answer.getAnswer(), answer.isCorrect(), answer.isSelected())).collect(
                Collectors.toList());
            return new QuestionRequest(question.getContent(), question.getPhoto() != null ? new String(question.getPhoto(), StandardCharsets.UTF_8) : null,
                question.getQuestionType().ordinal(), answers);
        }).collect(Collectors.toList());
        return new GameResponse(game.getId(), game.getName(), game.getNumberOfPlays(), game.getDateCreated(), game.getNumberOfHearts(),
            game.getPhoto() != null ? new String(game.getPhoto(), StandardCharsets.UTF_8) : null, game.getState().toString(), game.getShortDescription(), game.getCreator().getId(),
            questions, game.getCategories().stream().map(Category::getId).collect(Collectors.toList()),
            game.getUsersHearted().stream().map(User::getId).collect(Collectors.toList()));
    }
}
