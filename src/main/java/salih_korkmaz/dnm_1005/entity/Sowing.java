package salih_korkmaz.dnm_1005.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "sowing")
public class Sowing {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int sowingField;

    @ManyToOne
    @JoinColumn(name = "plant_id", nullable = false)
    @JsonManagedReference
    private Plant plant;

    @ManyToOne
    @JoinColumn(name = "land_id", nullable = false)
    @JsonManagedReference("land-sowing")
    private Land land;

    @Column(nullable = false)
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate sowingDate;
}
