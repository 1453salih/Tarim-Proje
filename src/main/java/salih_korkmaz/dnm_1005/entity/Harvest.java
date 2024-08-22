package salih_korkmaz.dnm_1005.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
@Entity
@Table(name="harvest")
public class Harvest{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sowing_id", nullable = false)
    private Sowing sowing;

    @Column(nullable = false)
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate harvestDate;

    @OneToOne(mappedBy = "harvest", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private Evaloution evaloution;
}