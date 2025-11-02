# Инструкция по запуску локальной версии Short Video Maker

## 🎯 Что добавлено в вашу версию

✅ **Кастомное аудио** - загружайте свои файлы вместо TTS  
✅ **Метаданные голосов** - удобный выбор голоса с описаниями  
✅ **Docker-готовность** - работает с n8n в контейнерах  

## 📋 Быстрый старт

### Шаг 1: Подготовка папок

Создайте папки на вашем диске:
```powershell
# Windows PowerShell
mkdir D:\n8n\custom-audio
mkdir D:\n8n\short-video-maker
```

### Шаг 2: Положите аудиофайлы

Скопируйте ваши MP3/WAV файлы в:
```
D:\n8n\custom-audio\моя-озвучка.mp3
```

### Шаг 3: Обновите docker-compose.yml

В `example/docker-compose.yml` указан путь к проекту:
```yaml
build:
  context: F:/Cursor/short-video-maker  # ← Укажите ваш путь!
  dockerfile: main-cuda.Dockerfile
```

### Шаг 4: Запустите сборку и старт

```powershell
# В папке example/ выполните:
docker compose up --build

# Или если хотите запускать в фоне:
docker compose up --build -d
```

**Первая сборка займет 10-15 минут** - скачиваются зависимости и компилируется Whisper.cpp с CUDA.

## 🎬 Использование кастомного аудио

### В n8n через REST API:

**HTTP Request Node:**
- Method: `POST`
- URL: `http://short-video-maker:3123/api/short-video`
- Headers: `Content-Type: application/json`
- Body (JSON):
```json
{
  "scenes": [
    {
      "customAudioUrl": "http://short-video-maker:3123/api/custom-audio/моя-озвучка.mp3",
      "searchTerms": ["forest", "nature", "walking"]
    }
  ],
  "config": {
    "music": "chill",
    "orientation": "portrait",
    "captionPosition": "bottom"
  }
}
```

### Проверка доступности аудио:

```powershell
# Проверьте что файлы доступны
curl http://localhost:3123/api/custom-audio/

# Проверьте конкретный файл
curl http://localhost:3123/api/custom-audio/моя-озвучка.mp3 -I
```

## 🔧 Дополнительные настройки

### Просмотр метаданных голосов:

```powershell
curl http://localhost:3123/api/voices-with-metadata
```

### Проверка здоровья сервиса:

```powershell
curl http://localhost:3123/health
```

### Логи:

```powershell
docker logs short-video-maker
docker logs short-video-maker -f  # в реальном времени
```

## 🐛 Troubleshooting

### Docker не находит путь к проекту

**Ошибка:** `context path `F:/Cursor/short-video-maker' not found`

**Решение:** Используйте относительный путь от папки `example/`:
```yaml
build:
  context: ..  # на уровень выше
  dockerfile: main-cuda.Dockerfile
```

### CUDA не работает

**Проверьте:**
```powershell
nvidia-smi  # должна показать GPU
docker run --rm --gpus all nvidia/cuda:12.3.1-base-ubuntu22.04 nvidia-smi
```

**Если нет GPU**, используйте обычную версию:
```yaml
dockerfile: main-tiny.Dockerfile  # вместо main-cuda.Dockerfile
```

### Аудио файлы не доступны

**Проверьте:**
1. Файлы в `D:\n8n\custom-audio\`
2. Права доступа (чтобы Docker мог читать)
3. Логи: `docker logs short-video-maker`

### Ошибка "customAudioUrl not found"

**Причины:**
- Неправильный путь к файлу
- Файл не существует
- Неправильная кодировка имени файла (используйте латиницу)

**Решение:** Используйте латинские имена:
```
✅ my-narration.mp3
❌ моя-озвучка.mp3  # если Docker не поддерживает UTF-8
```

## 📚 Пример полного workflow в n8n

```
1. Trigger (Schedule/Webhook)
   ↓
2. Read Binary File (читает аудио из D:\n8n\custom-audio\)
   ↓
3. HTTP Request → POST http://short-video-maker:3123/api/short-video
   Body: {
     "scenes": [{
       "customAudioUrl": "http://short-video-maker:3123/api/custom-audio/file.mp3",
       "searchTerms": ["your", "keywords"]
     }],
     "config": {...}
   }
   ↓
4. HTTP Request → GET http://short-video-maker:3123/api/short-video/{videoId}/status
   (polling до status = "ready")
   ↓
5. HTTP Request → GET http://short-video-maker:3123/api/short-video/{videoId}
   Response: Save to File (в D:\n8n\short-video-maker)
   ↓
6. Upload to YouTube/Instagram/TikTok
```

## 🎯 Отличия от официальной версии

| Функция | Официальная | Ваша версия |
|---------|-------------|-------------|
| TTS только | ✅ | ✅ |
| Кастомное аудио | ❌ | ✅ |
| Метаданные голосов | ❌ | ✅ |
| Локальные файлы | ❌ | ✅ |
| Docker поддержка | ✅ | ✅ |
| n8n интеграция | ✅ | ✅ |

## 📞 Нужна помощь?

1. Проверьте логи: `docker logs short-video-maker -f`
2. Проверьте health: `curl http://localhost:3123/health`
3. Проверьте доступ к аудио: `ls D:\n8n\custom-audio\`
4. Пересоберите образ: `docker compose up --build --force-recreate`

## ✨ Готово!

Теперь у вас есть полнофункциональный Short Video Maker с поддержкой кастомного аудио!

