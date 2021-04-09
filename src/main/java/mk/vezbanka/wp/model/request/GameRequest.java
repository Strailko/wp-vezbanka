package mk.vezbanka.wp.model.request;

import com.sun.istack.NotNull;
import java.util.List;

public class GameRequest {
    @NotNull
    public String name;

    public String photo;

    @NotNull
    public String shortDescription;

    @NotNull
    public Long creatorId;

    public List<QuestionRequest> questions;

    @NotNull
    public List<Long> categoryIds;

    public GameRequest(String name, String photo, String shortDescription, Long creatorId,
                       List<QuestionRequest> questions, List<Long> categoryIds) {
        this.name = name;
        this.photo = photo;
        this.shortDescription = shortDescription;
        this.creatorId = creatorId;
        this.questions = questions;
        this.categoryIds = categoryIds;
    }
}
