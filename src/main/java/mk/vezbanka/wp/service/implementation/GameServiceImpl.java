package mk.vezbanka.wp.service.implementation;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.*;
import javax.transaction.Transactional;
import mk.vezbanka.wp.model.Answer;
import mk.vezbanka.wp.model.Category;
import mk.vezbanka.wp.model.Game;
import mk.vezbanka.wp.model.Question;
import mk.vezbanka.wp.model.User;
import mk.vezbanka.wp.model.enums.GameState;
import mk.vezbanka.wp.model.request.GameRequest;
import mk.vezbanka.wp.repository.GameRepository;
import mk.vezbanka.wp.repository.UserRepository;
import mk.vezbanka.wp.service.CategoryService;
import mk.vezbanka.wp.service.GameService;
import org.springframework.stereotype.Service;

@Service
public class GameServiceImpl implements GameService {

    private final GameRepository gameRepository;
    private final UserRepository userRepository;
    private final CategoryService categoryService;

    public GameServiceImpl(GameRepository gameRepository, UserRepository userRepository,
                           CategoryService categoryService) {
        this.gameRepository = gameRepository;
        this.userRepository = userRepository;
        this.categoryService = categoryService;
    }

    @Override
    public Game getRandomGame() {
        List<Game> games = gameRepository.findAll();
        List<Long> gameIds = games.stream().map(Game::getId).collect(Collectors.toList());
        Random random = new Random();
        Long randomGameId = gameIds.get(random.nextInt(gameIds.size()));
        return getGameById(randomGameId);
    }

    @Override
    public Game getGameById(Long id) {
        return gameRepository.findById(id).orElseThrow(() ->
            new RuntimeException(String.format("Game with id %d doesn't exist in the database", id)));
    }

    @Override
    public Game createGame(GameRequest request) {
        Game game = new Game();
        setUpGameDetails(game, request);
        return game;
    }

    @Override
    public Game editGame(Long gameId, GameRequest request) {
        Game game = getGameById(gameId);
        setUpGameDetails(game, request);
        return game;
    }

    @Override
    public List<Game> searchGamesByName(String name) {
        return gameRepository.findAllByNameContainingIgnoreCase(name);
    }

    @Override
    public void updateNumberOfHearts(Long gameId) {
        Game game = getGameById(gameId);
        game.setNumberOfHearts(game.getNumberOfHearts()+1);

        save(game);
    }

    @Override
    public List<Game> getTopRankedGames() {
        return gameRepository.findByOrderByNumberOfHeartsDesc()
            .stream().limit(12)
            .collect(Collectors.toList());
    }

    @Override
    public List<Game> getLatestGames() {
        return gameRepository.findByOrderByDateCreatedDesc()
            .stream().limit(12)
            .collect(Collectors.toList());
    }

    @Override
    public List<Game> getTopPlayedGames() {
        return gameRepository.findByOrderByNumberOfPlaysDesc()
            .stream().limit(12)
            .collect(Collectors.toList());    }

    @Override
    public List<Game> getAllGames() {
        return gameRepository.findAll();
    }

    @Override
    public void deleteGame(Long id) {
        Game game = getGameById(id);
        gameRepository.delete(game);
    }

    private void save(Game game) {
        gameRepository.save(game);
    }

    @Transactional
    private void setUpGameDetails(Game game, GameRequest request) {
        game.setName(request.name);
        game.setShortDescription(request.shortDescription);

        User user = userRepository.findById(request.userCreatorId).orElseThrow(() ->
            new RuntimeException("No user with id " + request.userCreatorId));
        game.setCreator(user);
        game.setDateCreated(ZonedDateTime.now());
        game.setNumberOfHearts(0L);
        game.setNumberOfPlays(0L);
        game.setState(GameState.UNOPENED);

        if(request.photo != null) {
            game.setPhoto(request.photo);
        }

        List<Category> categoryList = new ArrayList<>();
        if(request.categoryIds != null || !request.categoryIds.isEmpty()) {
            request.categoryIds.forEach(categoryId ->
                categoryList.add(categoryService.getCategoryById(categoryId)));
        }
        game.setCategories(categoryList);

        List<Question> questionList = new ArrayList<>();

        request.questions.forEach(question -> {
            Question currentQuestion = new Question(question.content);
            List<Answer> answerList = new ArrayList<>();
            question.answers.forEach(answer ->
                answerList.add(new Answer(answer.answer, answer.isCorrect)));
            currentQuestion.setAnswers(answerList);

            if(question.photo != null) {
                currentQuestion.setPhoto(question.photo);
            }
            questionList.add(currentQuestion);
        });
        game.setQuestions(questionList);

        save(game);
    }
}
