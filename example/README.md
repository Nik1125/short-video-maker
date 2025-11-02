# Docker Compose Setup для Short Video Maker

Это пример конфигурации Docker Compose для интеграции **Short Video Maker** с **n8n**.

## 🚀 Быстрый старт

```powershell
# 1. Перейдите в папку example
cd example

# 2. Создайте папки для данных (если не созданы)
mkdir D:\n8n\custom-audio
mkdir D:\n8n\short-video-maker

# 3. Положите ваши аудиофайлы в
# D:\n8n\custom-audio\мой-файл.mp3

# 4. Соберите и запустите
docker compose up --build

# Или в фоне:
docker compose up --build -d
```

## 📁 Структура папок

```
D:\n8n\
├── n8n_docker_container\     # данные n8n
├── shared\                    # обмен между контейнерами
├── custom-audio\              # ← ВАШИ АУДИО ФАЙЛЫ СЮДА
│   └── my-narration.mp3
├── short-video-maker\         # готовые видео
└── remotion\                  # Remotion проект
```

## 🔧 Что внутри

### Сервисы:

1. **n8n** - ваша автоматизация
2. **short-video-maker** - создание видео с кастомным аудио
3. **remotion-renderer** - Remotion проект (опционально)

### Новая функциональность:

✅ **Кастомное аудио**: `POST /api/short-video` с `customAudioUrl`  
✅ **Метаданные голосов**: `GET /api/voices-with-metadata`  
✅ **Локальные файлы**: доступ через `/api/custom-audio/`  

## 📚 Документация

См. [INSTALLATION.md](./INSTALLATION.md) для подробной инструкции.

## 🔗 Полезные ссылки

- Health: http://localhost:3123/health
- Mетаданные голосов: http://localhost:3123/api/voices-with-metadata
- Custom audio: http://localhost:3123/api/custom-audio/

## ⚠️ Важно

**GPU поддерживается** - используется `main-cuda.Dockerfile`.

Если у вас нет GPU, замените в `docker-compose.yml`:
```yaml
dockerfile: main-tiny.Dockerfile  # вместо main-cuda.Dockerfile
```

## 💡 Пример использования в n8n

```json
POST http://short-video-maker:3123/api/short-video
{
  "scenes": [{
    "customAudioUrl": "http://short-video-maker:3123/api/custom-audio/my-voice.mp3",
    "searchTerms": ["nature", "forest"]
  }],
  "config": {
    "music": "chill",
    "orientation": "portrait"
  }
}
```

