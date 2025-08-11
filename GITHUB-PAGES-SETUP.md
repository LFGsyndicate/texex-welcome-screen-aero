# GitHub Pages Setup Instructions

## 🚨 Важно: Активация GitHub Actions

На скриншотах видно, что **GitHub Actions отключен** для вашего аккаунта. Необходимо его активировать:

### 1. Активация GitHub Actions

1. Перейдите в **Settings** репозитория
2. В левом меню выберите **Actions** → **General**
3. В разделе **Actions permissions** выберите:
   - ✅ **"Allow all actions and reusable workflows"**
4. Нажмите **Save**

### 2. Настройка GitHub Pages

1. В **Settings** репозитория перейдите в **Pages**
2. В разделе **Source** выберите:
   - ✅ **"GitHub Actions"** (не "Deploy from a branch")
3. Нажмите **Save**

### 3. Проверка настроек

После активации Actions:

1. Перейдите во вкладку **Actions** репозитория
2. Должен появиться workflow **"Deploy to GitHub Pages"**
3. Если workflow не запустился автоматически, нажмите **"Run workflow"**

## 🔧 Что было исправлено в коде

### 1. Vite Configuration (`vite.config.ts`)
```typescript
// Добавлена правильная настройка базового пути для GitHub Pages
base: process.env.NODE_ENV === 'production' ? '/texex-welcome-screen-aero/' : '/',
```

### 2. GitHub Actions Workflow (`.github/workflows/deploy.yml`)
- Упрощен и оптимизирован workflow
- Добавлена переменная окружения `NODE_ENV: production`
- Использован `npm ci` вместо `npm install` для стабильности

### 3. Статические файлы
- Создан `public/.nojekyll` для отключения Jekyll
- Добавлен `public/_config.yml` для настройки GitHub Pages

## 🚀 После настройки

1. **Коммит изменений**:
```bash
git add .
git commit -m "fix: Configure GitHub Pages deployment

- Set correct base path for GitHub Pages in vite.config.ts
- Optimize GitHub Actions workflow
- Add .nojekyll to disable Jekyll processing
- Add GitHub Pages configuration"
git push origin main
```

2. **Проверка деплоя**:
   - Перейдите в **Actions** → **Deploy to GitHub Pages**
   - Дождитесь завершения сборки (зеленая галочка)
   - Сайт будет доступен по адресу: `https://lfgsyndicate.github.io/texex-welcome-screen-aero/`

## 🔍 Диагностика проблем

### Если сборка падает:
1. Проверьте логи в **Actions** → **Deploy to GitHub Pages** → **build**
2. Убедитесь, что все зависимости установлены корректно
3. Проверьте, что нет синтаксических ошибок в коде

### Если сайт не отображается:
1. Проверьте настройки **Pages** в **Settings**
2. Убедитесь, что выбран источник **"GitHub Actions"**
3. Проверьте, что файл `.nojekyll` присутствует в `public/`

### Если стили не загружаются:
1. Проверьте правильность базового пути в `vite.config.ts`
2. Убедитесь, что все ассеты находятся в папке `public/`

## 📞 Поддержка

Если проблемы остаются:
1. Проверьте статус GitHub Actions в настройках аккаунта
2. Убедитесь, что у репозитория есть права на Pages
3. Проверьте лимиты GitHub Actions для вашего аккаунта