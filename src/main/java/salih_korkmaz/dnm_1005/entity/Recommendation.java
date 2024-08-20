package salih_korkmaz.dnm_1005.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
    import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "recommendations")
public class Recommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double succesRate;

    private String harvestPeriod;

    private String SowingPeriod;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plant_id")
    @JsonIgnore  // Döngüyü kırmak için
    private Plant plant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "locality_id")
    @JsonIgnore
    private Locality locality;
}
