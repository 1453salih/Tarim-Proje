package salih_korkmaz.dnm_1005.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import salih_korkmaz.dnm_1005.entity.PlantCategory;

import java.util.Optional;

public interface PlantCategoryRepository extends JpaRepository<PlantCategory, Long> {

    Optional<PlantCategory> findByPlant_Id(Long plantId);
}