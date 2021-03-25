package mk.vezbanka.wp.model.request;

import com.sun.istack.NotNull;

public class HeartedGameRequest {
    @NotNull
    public Long userId;

    @NotNull
    public Long gameId;
}
