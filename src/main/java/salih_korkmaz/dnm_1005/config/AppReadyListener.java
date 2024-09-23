package salih_korkmaz.dnm_1005.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import salih_korkmaz.dnm_1005.service.DbInitializer;
import salih_korkmaz.dnm_1005.util.Constants;

/**
 * Prepared by ahmeterdem on 11.09.2024 for Project Tarim-Proje.
 */
@Configuration
@RequiredArgsConstructor
public class AppReadyListener {
    private final ApplicationContext appContext;
    private final DbInitializer dbInitializer;
    @EventListener
    public void appReady(ApplicationReadyEvent event){
        System.out.println("Uygulama hazır");
        try{
            dbInitializer.initialize();
        }   catch (Exception e) {
            System.out.println("Db initialization esnasında hata alındı!"+e.toString());
            System.exit(SpringApplication.exit(appContext, () -> Constants.VERITABANI_INILIATIZATION_EXCEPTION_EXIT_CODE));
        }
    }
}
