package salih_korkmaz.dnm_1005.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @OneToMany(mappedBy = "plant", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
}
