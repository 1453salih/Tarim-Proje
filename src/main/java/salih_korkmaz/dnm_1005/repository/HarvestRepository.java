package salih_korkmaz.dnm_1005.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import salih_korkmaz.dnm_1005.entity.Harvest;

import java.util.List;
import java.util.Optional;

public interface HarvestRepository extends JpaRepository<Harvest,Long> {
    //*Sowing id üzerinden silme işlemi için tanımlandı
    Optional<Harvest> findBySowingId(Long sowingId);

    // SowingId'ye göre bir hasat kaydının var olup olmadığını kontrol eden metot
    boolean existsBySowingId(Long sowingId);
    //*Harvest entity'sinin Sowing, Land ve User entity'leri arasındaki ilişkiyi otomatik
    //* olarak takip eder ve belirli bir kullanıcıya ait tüm hasatları getirir.
    List<Harvest> findBySowingLandUserId(Long userId);
}
