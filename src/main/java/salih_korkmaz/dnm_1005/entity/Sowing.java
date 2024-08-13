package salih_korkmaz.dnm_1005.entity;

import jakarta.persistence.*;
import lombok.Data;


@Data
@Entity
@Table(name = "sowing")
public class Sowing {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name = "plant_id", nullable = false)
    private Plant plant;

    @JoinColumn(name = "land_id", nullable = false)
    private Land land;

}
