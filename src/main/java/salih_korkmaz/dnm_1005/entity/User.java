package salih_korkmaz.dnm_1005.entity;

import lombok.Data;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String user;

    @Column(nullable = false)
    private String password;

    @OneToMany(mappedBy = "user")
    private List<Land> lands;
}
