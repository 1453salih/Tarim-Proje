package salih_korkmaz.dnm_1005.entity;


import jakarta.persistence.*;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "evaluation")
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String weatherCondition; //Hava Koşulları

    private String irrigation;

    private String fertilisation;

    private String spraying;

    private String productQuality;

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
