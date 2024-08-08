package salih_korkmaz.dnm_1005.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.util.List;


@Data
@Entity
@Table(name = "land")
public class Land {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @Column(nullable = false, length = 50)
    String name;

    @Column(nullable = false)
    int landSize;

    @Column(nullable = false)
    String city;

    @Column(nullable = false)
    String district;

    String village;


}
