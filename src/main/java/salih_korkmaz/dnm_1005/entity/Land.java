package salih_korkmaz.dnm_1005.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
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

    @Column(nullable = false, length = 50)
    String name;

    @Column(nullable = false)
    int landSize;

    @Column(nullable = false)
    private String landType;

    private double clayableLand;

    @Column(nullable = true)
    String image;

    @ManyToOne
    @JoinColumn(name = "locality_code", referencedColumnName = "code")
    private Locality locality;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonBackReference("user-land")
    private User user;

    @OneToMany(mappedBy = "land", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference("land-sowing")
    private List<Sowing> sowings;
}
