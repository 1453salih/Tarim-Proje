# Proje Kurulumu


## Proje Tanıtımı:
**Ekim Rehberi** projesinde, ekim yapacak olan kullanıcı, ekim işleminden önce arazisini uygulamamıza kaydedip, o lokasyonda daha önce ekim yapmış kullanıcıların değerlendirme sonuçlarına göre bir öneri tablosu alır. Bu tabloda bitkiler ve başarı puanları yer alır. Başarı puanı, o bölgede ekim yapmış kullanıcıların değerlendirmelerine dayanarak belirlenir.

## Projede Yapılabilecekler:
- Kayıt Olma
- Giriş Yapma
- Arazi Ekleme
- Arazileri Görüntüleme
- Arazileri Filtreleme
- Arazileri Güncelleme
- Ekim Yapma (Mevcut araziler seçilerek ekim yapılabilir. Ekim sırasında bir arazinin belirli bir miktarı ekilebilir ve kalan miktar farklı bir bitki için kullanılabilir. Böylece arazi üzerindeki ekilmemiş alanın takibi yapılabilir.)
- Ekim Güncelleme
- Ekim Silme
- Hasat Etme
- Hasat İptal
- Hasat Değerlendirme
- Öneri Alma (Ekim yapmadan önce seçilen araziye göre hangi bitkinin başarılı olacağına dair öneri yapılır.)

## Teknolojiler:
- **Back-End:** Java Spring Framework
- **Front-End:** React + Material UI
- **Frontend Server:** Vite (Dinamik, hızlı ve performanslı işlemler için kullanıldı.)


## Kurulum

### Gereksinimler:
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Kurulum Adımları:

1. **Projeyi Klonlayın:**

   ```bash
   git clone https://github.com/kullanici_adi/ekim-rehberi.git
   cd ekim-rehberi
