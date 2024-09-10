package salih_korkmaz.dnm_1005.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false,length = 100)
    private String email;

    private String phone;

    private String name;

    private String surName;

    private String address;

    private String gender;

    @Column(nullable = false)
    private String password;

    @ManyToOne
    @JoinColumn(name = "locality_code", referencedColumnName = "code")
    private Locality locality;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("user-land")
    private List<Land> lands;
}
