package salih_korkmaz.dnm_1005.entity;


import jakarta.persistence.*;
import lombok.Data;
import lombok.Generated;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "evaluation")
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String harvestCondition;

    private String productQuality;

    private double overallRating;

    private double productQuantity;

    @OneToOne
    @JoinColumn(name = "harvest_id", nullable = false)
    private Harvest harvest;

    @Column(nullable = false)
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate evaluationDate;

    @PrePersist
    protected void onCreate() {
        this.evaluationDate = LocalDate.now();
    }
}
