package mk.vezbanka.wp.model.request;

import java.util.List;

public class ClassificationCategoryRequest {
    public Long id;

    public String name;

    public String photo;

    public List<String> words;

    //public ClassificationCategoryRequest(String name, String photo, List<String> words) {
    //    this.name = name;
    //    this.photo = photo;
    //    this.words = words;
    //}

    public ClassificationCategoryRequest(Long id, String name, String photo, List<String> words) {
        this.id = id;
        this.name = name;
        this.photo = photo;
        this.words = words;
    }
}
