# 🚨 КРИТИЧНО: Активация GitHub Actions

## Проблема
На скриншотах видно, что **GitHub Actions отключен** для вашего аккаунта. Без активации Actions сборка невозможна.

## ✅ Пошаговая активация GitHub Actions

### Шаг 1: Активация Actions в настройках репозитория
1. Откройте **Settings** репозитория
2. В левом меню найдите **Actions** → **General**
3. В разделе **Actions permissions** выберите:
   - ✅ **"Allow all actions and reusable workflows"**
4. **Нажмите Save**

### Шаг 2: Настройка GitHub Pages
1. В **Settings** перейдите в **Pages**
2. В разделе **Build and deployment**:
   - **Source**: выберите **"GitHub Actions"** (НЕ "Deploy from a branch")
3. **Нажмите Save**

### Шаг 3: Проверка активации
1. Перейдите во вкладку **Actions** репозитория
2. Должен появиться workflow **"Deploy to GitHub Pages"**
3. Если workflow не запустился, нажмите **"Run workflow"**

## 🔄 Альтернативное решение (если Actions недоступен)

Если GitHub Actions недоступен для вашего аккаунта, используйте ручной деплой:

### Вариант 1: Ручная сборка и деплой
```bash
# 1. Соберите проект локально
npm run build

# 2. Перейдите в папку dist
cd dist

# 3. Инициализируйте Git в папке dist
git init
git add .
git commit -m "Deploy to GitHub Pages"

# 4. Добавьте удаленный репозиторий для gh-pages ветки
git remote add origin https://github.com/LFGsyndicate/texex-welcome-screen-aero.git

# 5. Выгрузите в ветку gh-pages
git push -f origin main:gh-pages

# 6. Вернитесь в корень проекта
cd ..
```

### Вариант 2: Использование gh-pages пакета
```bash
# 1. Установите gh-pages
npm install --save-dev gh-pages

# 2. Добавьте скрипт в package.json
```

Добавьте в `package.json`:
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

```bash
# 3. Запустите деплой
npm run deploy
```

## 🛠️ Настройка для ручного деплоя

Если используете ручной деплой, измените настройки Pages:
1. **Settings** → **Pages**
2. **Source**: выберите **"Deploy from a branch"**
3. **Branch**: выберите **"gh-pages"** и **"/ (root)"**
4. **Нажмите Save**

## 🔍 Диагностика проблем

### Проверьте статус аккаунта:
1. Перейдите в настройки вашего **личного аккаунта** (не репозитория)
2. **Settings** → **Billing and plans**
3. Убедитесь, что у вас есть доступ к GitHub Actions

### Если Actions все еще недоступен:
- Возможно, ваш аккаунт имеет ограничения
- Обратитесь в GitHub Support
- Используйте альтернативные методы деплоя выше

## 📞 Поддержка

Если проблемы остаются:
1. Проверьте лимиты GitHub Actions для вашего аккаунта
2. Убедитесь, что репозиторий публичный (для бесплатного использования Actions)
3. Попробуйте альтернативные методы деплоя

## 🎯 Ожидаемый результат

После активации Actions:
- Сайт будет доступен: **https://lfgsyndicate.github.io/texex-welcome-screen-aero/**
- Автоматический деплой при каждом push в main
- Время сборки: ~2-3 минуты