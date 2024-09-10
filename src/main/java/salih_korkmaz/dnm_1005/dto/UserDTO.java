package salih_korkmaz.dnm_1005.dto;

import lombok.Data;

import java.util.List;

@Data
public class UserDTO {
    private Long id;
    private String email;
    private String phone;
    private String name;
    private String surName;
    private String address;
    private String gender;
    private LocalityDTO locality;
    private List<LandDTO> lands;
}
