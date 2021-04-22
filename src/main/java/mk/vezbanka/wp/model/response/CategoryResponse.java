package mk.vezbanka.wp.model.response;

import java.util.List;

public class CategoryResponse {
    public Long id;

    public String name;

    public String shortDescription;

    public String coverPhoto;

    public List<GameResponse> games;

    public CategoryResponse(Long id, String name, String shortDescription, String coverPhoto,
                            List<GameResponse> games) {
        this.id = id;
        this.name = name;
        this.shortDescription = shortDescription;
        this.coverPhoto = coverPhoto;
        this.games = games;
    }
}
