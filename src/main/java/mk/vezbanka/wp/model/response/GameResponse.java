package mk.vezbanka.wp.model.response;

import java.time.ZonedDateTime;
import java.util.List;
import mk.vezbanka.wp.model.request.QuestionRequest;

public class GameResponse {
    public Long id;

    public String name;

    public Long numberOfPlays;

    public ZonedDateTime dateCreated;

    public Long numberOfHearts;

    public String photo;

    public String state;

    public String shortDescription;

    public Long creatorId;

    public List<QuestionRequest> questions;

    public List<Long> categoryIds;

    public List<Long> usersHeartedIds;

    public GameResponse(Long id, String name, Long numberOfPlays, ZonedDateTime dateCreated, Long numberOfHearts,
                        String photo, String state, String shortDescription, Long creatorId,
                        List<QuestionRequest> questions, List<Long> categoryIds,
                        List<Long> usersHeartedIds) {
        this.id = id;
        this.name = name;
        this.numberOfPlays = numberOfPlays;
        this.dateCreated = dateCreated;
        this.numberOfHearts = numberOfHearts;
        this.photo = photo;
        this.state = state;
        this.shortDescription = shortDescription;
        this.creatorId = creatorId;
        this.questions = questions;
        this.categoryIds = categoryIds;
        this.usersHeartedIds = usersHeartedIds;
    }
}
