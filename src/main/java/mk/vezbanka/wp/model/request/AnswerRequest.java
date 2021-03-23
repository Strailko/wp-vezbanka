package mk.vezbanka.wp.model.request;

import com.sun.istack.NotNull;

public class AnswerRequest {
    @NotNull
    public String answer;

    @NotNull
    public boolean isCorrect;
}
