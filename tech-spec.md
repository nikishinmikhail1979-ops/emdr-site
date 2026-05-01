# Техническая спецификация — EMDR Self-Practice Tool

## Зависимости

- React 19
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui (Button, Slider, Card)
- Lucide React (иконки: Maximize2, Minimize2, VolumeX, Play, Square, ChevronDown, ChevronUp, ArrowLeftRight, ArrowUpDown, ArrowUpLeft, ArrowDownRight)
- Web Audio API (нативный, без внешних библиотек)

## Архитектура

### Инициализация
- Стандартная инициализация через `bash scripts/init-webapp.sh`
- Аудио-файлы копируются в `public/audio/`

### Компоненты

| Компонент | Описание | Путь |
|---|---|---|
| `EMDRApp` | Корневой компонент, хранит все состояния | `src/App.tsx` |
| `InstructionPanel` | Информационный хедер с инструкциями | `src/sections/InstructionPanel.tsx` |
| `ControlsPanel` | Панель визуальных и аудио настроек | `src/sections/ControlsPanel.tsx` |
| `ClientView` | Канвас с анимацией стимула + fullscreen | `src/sections/ClientView.tsx` |
| `StatusBar` | Таймер, счетчик, кнопки управления | `src/sections/StatusBar.tsx` |
| `BackgroundPicker` | Выбор фона канваса | `src/components/BackgroundPicker.tsx` |
| `ColorPicker` | Выбор цвета стимула | `src/components/ColorPicker.tsx` |
| `ShapePicker` | Выбор формы стимула (SVG) | `src/components/ShapePicker.tsx` |
| `DirectionPicker` | Выбор направления движения | `src/components/DirectionPicker.tsx` |
| `SoundPicker` | Выбор звука (выкл/pop/beep) | `src/components/SoundPicker.tsx` |
| `SpeedSlider` | Ползунок скорости | `src/components/SpeedSlider.tsx` |

### Хуки

| Хук | Описание | Путь |
|---|---|---|
| `useEMDRAnimation` | requestAnimationFrame, позиция стимула, счетчик проходов | `src/hooks/useEMDRAnimation.ts` |
| `useAudioEngine` | Web Audio API: загрузка буферов, stereo panner, воспроизведение | `src/hooks/useAudioEngine.ts` |
| `useTimer` | Секундомер (формат MM:SS) | `src/hooks/useTimer.ts` |

### Состояние (useState в EMDRApp)

- `isRunning: boolean` — запущена ли анимация
- `speed: number (1-20)` — скорость движения
- `direction: 'horizontal' | 'vertical' | 'diagonal1' | 'diagonal2'`
- `background: string` — цвет/градиент фона канваса
- `stimulusColor: string` — цвет стимула
- `stimulusShape: 'circle' | 'square' | 'vertical-bar' | 'horizontal-bar'`
- `soundMode: 'off' | 'pop' | 'beep'`
- `isStimulusVisible: boolean`
- `isFullscreen: boolean`
- `isInstructionsOpen: boolean`
- `passes: number`
- `time: string` — формат MM:SS

### Ключевые реализации

**Аудио-движок (Web Audio API):**
- `AudioContext` создается по первому взаимодействию (клик Start).
- Звуковые файлы загружаются через `fetch → arrayBuffer → audioContext.decodeAudioData()`.
- Для стерео-панорамирования используется `StereoPannerNode`, подключенный между `AudioBufferSourceNode` и `destination`.
- Значение `pan.value` обновляется каждый кадр анимации: `pan.value = (stimulusX / canvasWidth) * 2 - 1`.
- Звук воспроизводится при достижении шариком крайних точек (инверсия направления).

**Анимация стимула:**
- `requestAnimationFrame` с timestamp.
- Позиция по синусоиде: `amplitude * Math.sin(time * speed * baseFrequency)`.
- Детекция крайних точек через сравнение предыдущего и текущего направления.
- Рендеринг на canvas 2D context: `clearRect → fillRect/fillRect` (фон + стимул).

**Fullscreen:**
- Fullscreen API (`element.requestFullscreen()` / `document.exitFullscreen()`).
- Кнопка fullscreen в ClientView и StatusBar дублируют функционал.

## Таблица переменных (для дизайнера)

| Переменная | Значение | Использование |
|---|---|---|
| `--bg-page` | `#F1F5F9` | body background |
| `--bg-hero` | `#F8FAFC` | instruction panel bg |
| `--bg-card` | `#FFFFFF` | cards, panels |
| `--color-primary` | `#2563EB` | headings, active states |
| `--color-green` | `#10B981` | start button |
| `--color-red` | `#EF4444` | stop button, stimulus option |
| `--color-heading` | `#1E3A5F` | page title, timer |
| `--color-text` | `#1F2937` | body text |
| `--color-text-secondary` | `#6B7280` | labels, captions |
| `--warning-bg` | `#FEF3C7` | warning block bg |
| `--warning-border` | `#F59E0B` | warning block left border |
| `--card-radius` | `10px` | all cards |
| `--card-shadow` | `0 1px 3px rgba(0,0,0,0.06)` | all cards |
| `--button-hover-scale` | `1.08` | color/shape buttons |
| `--transition-fast` | `150ms ease` | hovers |
| `--transition-normal` | `300ms ease` | panels, fullscreen |
| `--canvas-aspect` | `4/3` | client view default |
| `--stimulus-size` | `30px` | ball size on canvas |

## Требования к аудио-файлам

- `public/audio/pop.mp3` — стерео, 48kHz, ~0.43s
- `public/audio/beep.mp3` — моно, 44.1kHz, ~0.39s
- Оба файла должны быть скопированы в `public/audio/` перед сборкой.
