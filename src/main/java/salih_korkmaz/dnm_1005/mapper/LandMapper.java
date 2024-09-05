package salih_korkmaz.dnm_1005.mapper;


import org.springframework.stereotype.Component;
import salih_korkmaz.dnm_1005.dto.LandDTO;
import salih_korkmaz.dnm_1005.entity.Land;
import salih_korkmaz.dnm_1005.entity.Locality;
import salih_korkmaz.dnm_1005.entity.User;


@Component
public class LandMapper {

    private final LocationMapper locationMapper;

    public LandMapper(LocationMapper locationMapper) {
        this.locationMapper = locationMapper;
    }

    // DTO'dan entity'ye dönüşüm metodu
    public Land toEntity(LandDTO landDto, User user, Locality locality) {
        Land land = new Land();
        land.setName(landDto.getName());
        land.setLandSize(landDto.getLandSize());
        land.setUser(user);
        land.setLocality(locality);
        land.setLandType(landDto.getLandType()); // landType burada set ediliyor
        land.setClayableLand(landDto.getLandSize());
        return land;
    }

    // Entity'den DTO'ya dönüşüm metodu
    public LandDTO toDTO(Land land) {
        LandDTO landDto = new LandDTO();
        landDto.setId(land.getId());
        landDto.setName(land.getName());
        landDto.setLandSize(land.getLandSize());
        landDto.setLandType(land.getLandType());
        landDto.setClayableLand(land.getClayableLand());
        landDto.setUserId(land.getUser().getId());
        landDto.setLocalityId(land.getLocality().getCode());
        landDto.setImageUrl(land.getImage());
        landDto.setLocation(locationMapper.toLocationDTO(land)); // Location bilgisi de set ediliyor
        return landDto;
    }
}
