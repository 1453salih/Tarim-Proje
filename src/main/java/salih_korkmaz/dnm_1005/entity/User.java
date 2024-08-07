package salih_korkmaz.dnm_1005.entity;

import lombok.Data;

import jakarta.persistence.*;

@Entity
@Data
@Table(name = "mydb")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String user;

    @Column(nullable = false)
    private String password;
}
