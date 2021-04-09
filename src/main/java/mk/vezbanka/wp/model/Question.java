package mk.vezbanka.wp.model;

import java.util.List;
import java.util.Map;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import lombok.Data;
import mk.vezbanka.wp.model.enums.QuestionType;
import org.hibernate.annotations.Type;

@Entity
@Data
@Table(name = "questions")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;

    @Lob
    @Type(type = "org.hibernate.type.ImageType")
    private byte[] photo;

    @OneToMany(cascade = {CascadeType.ALL})
    private List<Answer> answers;

    @Enumerated(EnumType.STRING)
    private QuestionType questionType;

    //private Map<ClassificationCategory, String> tocniOdgovori = (kategorija, zbor)

    public Question(String content) {
        this.content = content;
    }

    public Question() {
    }
}
