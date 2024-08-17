package salih_korkmaz.dnm_1005.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "district")
public class District {

    @Id
    private long code;

    private String name;
    private String slug;
    private String type;
    private String latitude;
    private String longitude;

    @ManyToOne
    @JoinColumn(name = "parentcode", referencedColumnName = "code")
    private City city;

    @OneToMany(mappedBy = "district")
    private List<Locality> localities;

}

