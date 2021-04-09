package mk.vezbanka.wp.model.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class UserResponse {
    public Long id;

    public String username;

    public String firstName;

    public String lastName;

    public String email;

    public Set<String> roles = new HashSet<>();

    public String photo;

    public String biography;

    public List<GameResponse> heartedGames;

    public UserResponse(Long id, String username, String firstName, String lastName, String email,
                        Set<String> roles, String photo, String biography,
                        List<GameResponse> heartedGames) {
        this.id = id;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.roles = roles;
        this.photo = photo;
        this.biography = biography;
        this.heartedGames = heartedGames;
    }
}
