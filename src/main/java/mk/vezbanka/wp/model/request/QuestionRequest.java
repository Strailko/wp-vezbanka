package mk.vezbanka.wp.model.request;

import com.sun.istack.NotNull;
import java.util.List;

public class QuestionRequest {
    @NotNull
    public String content;

    public String photo;

    public List<AnswerRequest> answers;
}
