package salih_korkmaz.dnm_1005.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "plant")
public class Plant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;


    @OneToMany(mappedBy = "plant", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonBackReference // Döngüyü kırmak için bu anotasyon kullanılabilir
    private List<Sowing> sowings;

    private String image;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    @JsonIgnore
    private PlantCategory plantCategory; //mappedBy'da kullanılan kısımdır.("plantCategory")

    @OneToMany(mappedBy = "plant", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore  // Döngüyü kırmak için
    private List<Recommendation> recommendations;

    private double yieldPerSquareMeter;

}
