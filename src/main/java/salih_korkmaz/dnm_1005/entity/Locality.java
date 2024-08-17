package salih_korkmaz.dnm_1005.entity;

import jakarta.persistence.*;
import lombok.Data;


@Data
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
    private District district;
}
