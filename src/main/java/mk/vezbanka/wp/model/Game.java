package mk.vezbanka.wp.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import java.time.ZonedDateTime;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import lombok.Data;
import mk.vezbanka.wp.model.enums.GameState;
import org.hibernate.annotations.Type;

@Entity
@Data
@Table(name = "games")
@JsonIdentityInfo(generator=ObjectIdGenerators.PropertyGenerator.class, property="id")
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private Long numberOfPlays;

    private ZonedDateTime dateCreated;

    private Long numberOfHearts;

    @Lob
    @Type(type = "org.hibernate.type.ImageType")
    private byte[] photo;

    @Enumerated(EnumType.STRING)
    private GameState state;

    private String shortDescription;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.REFRESH})
    private User creator;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.REFRESH})
    private User player;

    @OneToMany(cascade = {CascadeType.ALL})
    private List<Question> questions;

    @ManyToMany(mappedBy = "games", fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.REFRESH})
    private List<Category> categories;

    @ManyToMany(mappedBy = "heartedGames", cascade = CascadeType.ALL)
    private List<User> usersHearted;
}
