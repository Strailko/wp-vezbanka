package mk.vezbanka.wp.model.request;

import com.sun.istack.NotNull;
import java.util.List;
import java.util.Map;
import mk.vezbanka.wp.model.ClassificationCategory;

//TODO: Change name
public class QuestionRequest {
    @NotNull
    public String content;

    public String photo;

    public int questionType;

    public List<AnswerRequest> answers;

    public List<ClassificationCategoryRequest> classes;

    public QuestionRequest(String content, String photo, int questionType,
                           List<AnswerRequest> answers, List<ClassificationCategoryRequest> classes) {
        this.content = content;
        this.photo = photo;
        this.questionType = questionType;
        this.answers = answers;
        this.classes = classes;
    }
}
