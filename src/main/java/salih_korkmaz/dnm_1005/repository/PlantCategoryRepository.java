package salih_korkmaz.dnm_1005.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import salih_korkmaz.dnm_1005.entity.PlantCategory;

import java.util.Optional;

public interface PlantCategoryRepository extends JpaRepository<PlantCategory, Long> {

    // Bitki ID'sine göre kategoriyi bulmak için custom query
    @Query("SELECT pc FROM PlantCategory pc JOIN Plant p ON pc.id = p.plantCategory.id WHERE p.id = :plantId")
    Optional<PlantCategory> findCategoryByPlantId(@Param("plantId") Long plantId);
}
