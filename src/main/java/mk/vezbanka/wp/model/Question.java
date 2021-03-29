package mk.vezbanka.wp.model;

import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import lombok.Data;
import mk.vezbanka.wp.model.enums.QuestionType;

@Entity
@Data
@Table(name = "questions")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public Question(String content) {
        this.content = content;
    }

    public Question() {
    }

    private String content;

    private String photo;

    @OneToMany(cascade = {CascadeType.ALL})
    private List<Answer> answers;

    @Enumerated(EnumType.STRING)
    private QuestionType questionType;
}
