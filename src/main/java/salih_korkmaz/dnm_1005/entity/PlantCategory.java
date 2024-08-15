package salih_korkmaz.dnm_1005.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;


@Data
@Entity
@Table(name = "plant_category")
public class PlantCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String categoryName;


    @OneToMany(mappedBy = "plantCategory", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Plant> plant;// mappedBy
}
