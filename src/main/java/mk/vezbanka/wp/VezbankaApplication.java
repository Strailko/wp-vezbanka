package mk.vezbanka.wp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "mk.vezbanka.wp")
@ServletComponentScan
public class VezbankaApplication {

    public static void main(String[] args) {
        SpringApplication.run(VezbankaApplication.class, args);
    }

}
