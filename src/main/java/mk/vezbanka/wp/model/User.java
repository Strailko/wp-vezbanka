package mk.vezbanka.wp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.Lob;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import lombok.Data;
import org.hibernate.annotations.Type;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    @JsonIgnore
    private String password;

    private String firstName;

    private String lastName;

    private String email;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(	name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    @Lob
    @Type(type = "org.hibernate.type.ImageType")
    private byte[] photo;

    private String biography;

    @ManyToMany
    @JoinTable(
        name = "hearted_games",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "game_id"))
    private List<Game> heartedGames;

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public User() {
    }
}
