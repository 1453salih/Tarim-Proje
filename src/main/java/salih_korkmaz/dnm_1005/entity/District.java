package salih_korkmaz.dnm_1005.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "district")
public class District {

    @Id
    private long code;

    private String name;
    private String latitude;
    private String longitude;
    private String slug;
    private String type;


    @ManyToOne
    @JoinColumn(name = "parentcode", referencedColumnName = "code", insertable = false, updatable = false)
    @JsonManagedReference  // City serileştirilecek
    private City city;

    @OneToMany(mappedBy = "district")
    @JsonBackReference  // Localities geri referans olarak işaretleniyor
    private List<Locality> localities;

}