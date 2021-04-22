package mk.vezbanka.wp.model;

import java.util.List;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Table;
import lombok.Data;
import org.hibernate.annotations.Type;

@Entity
@Data
@Table(name = "classification_category")
public class ClassificationCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Lob
    @Type(type = "org.hibernate.type.ImageType")
    private byte[] photo;

    @ElementCollection
    private List<String> words;

    public ClassificationCategory() {
    }

    public ClassificationCategory(String name, byte[] photo, List<String> words) {
        this.name = name;
        this.photo = photo;
        this.words = words;
    }
}
