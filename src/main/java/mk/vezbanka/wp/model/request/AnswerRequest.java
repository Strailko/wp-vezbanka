package mk.vezbanka.wp.model.request;

import com.sun.istack.NotNull;

public class AnswerRequest {
    @NotNull
    public String answer;

    @NotNull
    public boolean isCorrect;

    public boolean isSelected;

    public AnswerRequest(String answer, boolean isCorrect, boolean isSelected) {
        this.answer = answer;
        this.isCorrect = isCorrect;
        this.isSelected = isSelected;
    }
}
