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
    public Long userCreatorId;

    public List<QuestionRequest> questions;

    @NotNull
    public List<Long> categoryIds;
}
