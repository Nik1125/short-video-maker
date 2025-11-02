# 🚀 Быстрый старт локальной версии Short Video Maker

## Что добавлено в вашу версию

✅ **Кастомное аудио** - передавайте свои MP3/WAV файлы  
✅ **Метаданные голосов** - удобный выбор с описаниями  
✅ **Docker-ready** - работает с n8n  

## 3 шага для запуска

### 1️⃣ Подготовка папок

```powershell
# Создайте папки для аудио и видео
mkdir D:\n8n\custom-audio
mkdir D:\n8n\short-video-maker

# Положите ваши аудиофайлы в custom-audio
# Например: D:\n8n\custom-audio\my-voice.mp3
```

### 2️⃣ Сборка и запуск

```powershell
# Перейдите в example
cd example

# Соберите и запустите (первая сборка ~10-15 минут)
docker compose up --build

# Или в фоне:
docker compose up --build -d
```

### 3️⃣ Использование

**В n8n или через curl:**

```bash
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

**Проверка:**

```powershell
# Health
curl http://localhost:3123/health

# Голоса с метаданными
curl http://localhost:3123/api/voices-with-metadata

# Доступные файлы
curl http://localhost:3123/api/custom-audio/
```

## 📚 Документация

- Полная инструкция: [example/INSTALLATION.md](./example/INSTALLATION.md)
- Пример конфига: [example/docker-compose.yml](./example/docker-compose.yml)

## ⚠️ Важные замечания

1. **GPU**: Используется CUDA-версия. Если нет GPU, замените в `docker-compose.yml`:
   ```yaml
   dockerfile: main-tiny.Dockerfile  # вместо main-cuda.Dockerfile
   ```

2. **Путь к проекту**: В `example/docker-compose.yml` указан `context: ..` (относительный)

3. **Имена файлов**: Используйте латиницу для лучшей совместимости:
   - ✅ `my-voice.mp3`
   - ❌ `моя-озвучка.mp3`

## 🔥 Что дальше?

Готово! Теперь можете создавать видео с **вашей** озвучкой! 🎬

Для помощи см. [example/INSTALLATION.md](./example/INSTALLATION.md)

