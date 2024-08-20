package salih_korkmaz.dnm_1005.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "localities")
public class Locality {

    @Id
    private long code;

    private String name;
    private String slug;
    private String type;

    @ManyToOne(optional = true)
    @JoinColumn(name = "parentcode", referencedColumnName = "code")
    @JsonBackReference  // District geri referans olarak işaretleniyor
    private District district;

    @OneToMany(mappedBy = "locality", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference  // Recommendations serileştirilecek
    private List<Recommendation> recommendations;
}
