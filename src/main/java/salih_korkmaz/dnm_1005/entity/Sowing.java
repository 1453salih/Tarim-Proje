package salih_korkmaz.dnm_1005.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "sowing")
public class Sowing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plant_id" , nullable = false)
    @JsonBackReference("plant-sowing")
    private Plant plant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "land_id" , nullable = false)
    @JsonBackReference("land-sowing")
    private Land land;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "sowing_date", nullable = false, updatable = false)
    private Date sowingdDate;

    @PrePersist
    protected void onCreate() {
        sowingdDate = new Date();
    }
}
