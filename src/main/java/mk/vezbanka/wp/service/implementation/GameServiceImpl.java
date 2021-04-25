package mk.vezbanka.wp.service.implementation;

import java.nio.charset.StandardCharsets;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.*;
import javax.transaction.Transactional;
import mk.vezbanka.wp.model.Answer;
import mk.vezbanka.wp.model.Category;
import mk.vezbanka.wp.model.ClassificationCategory;
import mk.vezbanka.wp.model.Game;
import mk.vezbanka.wp.model.Question;
import mk.vezbanka.wp.model.User;
import mk.vezbanka.wp.model.enums.GameState;
import mk.vezbanka.wp.model.enums.QuestionType;
import mk.vezbanka.wp.model.request.AnswerRequest;
import mk.vezbanka.wp.model.request.ClassificationCategoryRequest;
import mk.vezbanka.wp.model.request.GameRequest;
import mk.vezbanka.wp.model.request.QuestionRequest;
import mk.vezbanka.wp.repository.GameRepository;
import mk.vezbanka.wp.repository.UserRepository;
import mk.vezbanka.wp.service.CategoryService;
import mk.vezbanka.wp.service.ClassificationCategoryService;
import mk.vezbanka.wp.service.GameService;
import org.springframework.stereotype.Service;

@Service
public class GameServiceImpl implements GameService {

    private final GameRepository gameRepository;
    private final UserRepository userRepository;
    private final CategoryService categoryService;
    private final ClassificationCategoryService classificationCategoryService;

    public GameServiceImpl(GameRepository gameRepository, UserRepository userRepository,
                           CategoryService categoryService, ClassificationCategoryService classificationCategoryService) {
        this.gameRepository = gameRepository;
        this.userRepository = userRepository;
        this.categoryService = categoryService;
        this.classificationCategoryService = classificationCategoryService;
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
    public void increaseNumberOfHearts(Long gameId) {
        Game game = getGameById(gameId);
        game.setNumberOfHearts(game.getNumberOfHearts()+1);
        save(game);
    }

    @Override
    public void decreaseNumberOfHearts(Long gameId) {
        Game game = getGameById(gameId);
        game.setNumberOfHearts(game.getNumberOfHearts()-1);
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

    // Maybe in the future this method can save an instance of the user's game with results and score
    // (new CompletedGame entity?)
    // TODO: Logic for different question types needs to be implemented
    @Override
    public float submitGame(Long id, GameRequest completedGame) {
        float score = 0;
        // standard for loops are used because you can't change the value of correctAnswers in a lambda expression
        // explanation: https://stackoverflow.com/a/50341404/6553931
        for (QuestionRequest question : completedGame.questions) {

            switch (question.questionType) {
                //SELECTABLE
                case 0: {
                    int numberOfCorrectAnswers =
                        (int) question.answers.stream().filter(answer -> answer.isCorrect).count();

                    if (numberOfCorrectAnswers ==
                        0) // this shouldn't be allowed, temporary fix is to skip the iteration
                        continue;

                    float scorePerCorrectAnswer = 1f / numberOfCorrectAnswers;
                    int numberOfCorrectSelectedAnswers = 0;
                    int numberOfIncorrectSelectedAnswers = 0;

                    for (AnswerRequest answer : question.answers) {
                        if (answer.isCorrect && answer.isSelected) {
                            numberOfCorrectSelectedAnswers += 1;
                        } else if (!answer.isCorrect && answer.isSelected) {
                            numberOfIncorrectSelectedAnswers += 1;
                        }
                    }

                    // I am not 100% how correct this formula is, there might be a slight problem with rounding numbers
                    float questionScore = numberOfCorrectSelectedAnswers * scorePerCorrectAnswer -
                        ((numberOfIncorrectSelectedAnswers * scorePerCorrectAnswer) / 2);
                    //if the score is negative, make it 0
                    score += questionScore > 0 ? questionScore : 0;
                    break;
                }
                //CLASSIFICATION
                case 2: {
                    /*
                    * numberOfAllCorrectAnswers = zbir od (length od site words) za sekoja kategorija -> klasa.forEach{soberi length na words vo edna promenliva}
                    request.klasa.forEach{ klasa -> klasa.words.forEach{question.klasa.words.contains(word) -> zgolemi counter } }
                    score = tocni/numberOfAllCorrectAnswers
                    * */
                    int numberOfAllClassifications = 0;
                    for (ClassificationCategoryRequest el : question.classes) {
                        ClassificationCategory correctClassificationClass =
                            classificationCategoryService.findById(el.id);
                        numberOfAllClassifications += correctClassificationClass.getWords().size();
                    }

                    int numberOfCorrectClassifications = 0;
                    for (ClassificationCategoryRequest el : question.classes) {
                        for (String userClassifiedWord : el.words) {
                            ClassificationCategory retrievedCategory = classificationCategoryService.findById(el.id);
                            if (retrievedCategory.getWords().contains(userClassifiedWord))
                                numberOfCorrectClassifications += 1;
                        }
                    }

                    score += (float) numberOfCorrectClassifications / numberOfAllClassifications;
                    break;
                }
            }
        }

        float result = score / completedGame.questions.size() * 100;

        // Get the game we have saved in the database by the id, and increase the number of plays
        // (this shouldn't be done on the completedGame object because that will save the values for "isSelected" on
        // the answers)
        Game game = getGameById(id);
        game.setNumberOfPlays(game.getNumberOfPlays() + 1);
        save(game);

        return result;
    }

    @Transactional
    private void setUpGameDetails(Game game, GameRequest request) {
        game.setName(request.name);
        game.setShortDescription(request.shortDescription);

        User user = userRepository.findById(request.creatorId).orElseThrow(() ->
            new RuntimeException("No user with id " + request.creatorId));
        game.setCreator(user);
        game.setDateCreated(ZonedDateTime.now());
        game.setNumberOfHearts(0L);
        game.setNumberOfPlays(0L);
        game.setState(GameState.UNOPENED);

        if(request.photo != null) {
            game.setPhoto(request.photo.getBytes(StandardCharsets.UTF_8));
        }

        List<Question> questionList = new ArrayList<>();

        request.questions.forEach(question -> {
            Question currentQuestion = new Question(question.content);

            List<ClassificationCategory> classes = new ArrayList<>();
            question.classes.forEach(el -> classes.add(new ClassificationCategory(el.name,
                el.photo != null ? el.photo.getBytes(StandardCharsets.UTF_8) : null, el.words)));
            currentQuestion.setClasses(classes);

            List<Answer> answerList = new ArrayList<>();
            question.answers.forEach(answer ->
                answerList.add(new Answer(answer.answer, answer.isCorrect)));
            currentQuestion.setAnswers(answerList);
            if (question.questionType == 0)
                currentQuestion.setQuestionType(QuestionType.SELECTION);
            else if (question.questionType == 1)
                currentQuestion.setQuestionType(QuestionType.DRAGGABLE);
            else if (question.questionType == 2)
                currentQuestion.setQuestionType(QuestionType.CLASSIFICATION);

            if(question.photo != null) {
                currentQuestion.setPhoto(question.photo.getBytes(StandardCharsets.UTF_8));
            }
            questionList.add(currentQuestion);
        });
        game.setQuestions(questionList);

        save(game);


        // Because of the many-to-many mapping, Category is the entity that's the "owner" of games, so we need to save
        // the categories the game belongs to through a Category object first in order for them to be saved in the db.
        List<Category> categoryList = new ArrayList<>();
        if(request.categoryIds != null || !request.categoryIds.isEmpty()) {
            //save the current game in each category it belongs to, through the method addGameToCategory
            request.categoryIds.forEach(categoryId -> {
                Category currentCategory = categoryService.getCategoryById(categoryId);
                //if the game is already added to the current category, don't add it again (this prevents creating
                // duplicate entries in the categories_games table)
                if (!currentCategory.getGames().contains(game)) {
                    categoryService.addGameToCategory(categoryId, game);
                }

                //add each category to categoryList which will later be saved in the entity game
                categoryList.add(currentCategory);
            });
        }
        //remove all the categories which were previously in the game but are not anymore with the edit
        if(game.getCategories() != null && !game.getCategories().isEmpty()) {
            List<Category> temporaryList = new ArrayList<>(game.getCategories());
            //This will remove the categories that were already added and
            // the categories that need to be removed will stay in temporaryList
            temporaryList.removeAll(categoryList);

            temporaryList.forEach(cat -> {
                if (cat.getGames().contains(game))
                    categoryService.removeGameFromCategory(cat.getId(), game);
            });
        }

            game.setCategories(categoryList);

        save(game);
    }
}
