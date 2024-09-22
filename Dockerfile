# Temel alınacak Java imajı
FROM openjdk:17-jdk-alpine

# Projeden oluşan JAR dosyasını kopyalayın
COPY target/dnm_1005-0.0.1-SNAPSHOT.jar app.jar

# Uygulamanın dinleyeceği port
EXPOSE 8080

# Uygulamayı başlatma komutu
ENTRYPOINT ["java", "-jar", "/app.jar"]


