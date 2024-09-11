package salih_korkmaz.dnm_1005.service;

import java.util.ArrayList;
import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import salih_korkmaz.dnm_1005.entity.City;
import salih_korkmaz.dnm_1005.repository.CityRepository;

/**
 * Prepared by ahmeterdem on 11.09.2024 for Project Tarim-Proje.
 */

@Component
@RequiredArgsConstructor
public class DbInitializer {
    private final CityRepository cityRepository;

    public void initialize(){
        ilEkle();
    }
    private void ilEkle(){
        List<City> sehirListesi=cityRepository.findAll();
        if (sehirListesi.size()<1){
            cityRepository.deleteAll();
        }

        cityRepository.save(new City(1,"Adana","","","36.9914","35.3308",new ArrayList<>()));
        cityRepository.save(new City(1,"Adıyaman","","","36.9914","35.3308",new ArrayList<>()));


    }
}
