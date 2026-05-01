import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onToggle: () => void;
}

const InstructionPanel: React.FC<Props> = ({ isOpen, onToggle }) => {
  return (
    <div className="w-full max-w-[1100px] mx-auto px-4 mb-6">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 mx-auto mb-4 px-5 py-2.5 bg-white border border-[#CBD5E1] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#F8FAFC] transition-colors duration-150"
      >
        {isOpen ? (
          <>
            <ChevronUp size={16} />
            Скрыть инструкции
          </>
        ) : (
          <>
            <ChevronDown size={16} />
            Показать инструкции
          </>
        )}
      </button>

      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isOpen ? '3000px' : '0',
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="bg-white rounded-xl p-6 md:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <h2 className="text-[22px] font-bold text-[#1E3A5F] mb-5">
            Протокол безопасной самопомощи EMDR
          </h2>

          {/* Warning block */}
          <div className="bg-[#FEF3C7] border-l-4 border-[#F59E0B] rounded-r-lg p-4 mb-6">
            <p className="text-[15px] italic text-[#92400E] leading-relaxed">
              Полноценный протокол EMDR (обработка травматических воспоминаний) требует обученного терапевта. Самостоятельно безопасно применять только стабилизационные техники и лёгкое ресурсирование. Обработку «тяжёлых» воспоминаний оставьте специалисту — риск ретравматизации и диссоциации высок.
            </p>
          </div>

          {/* Application cases */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-[#1E3A5F] mb-3">
              Когда самостоятельная визуальная БЛС возможна:
            </h3>
            <ul className="space-y-2">
              {[
                'Снижение повседневной тревоги и стресса;',
                'Управление лёгкими триггерами между сессиями с терапевтом;',
                'Укрепление «ресурсов» — чувства безопасности, уверенности, спокойствия;',
                'Подготовка к сложным событиям (переговоры, выступления);',
                'Заземление при тревожных мыслях «здесь и сейчас».',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[15px] text-[#374151] leading-relaxed">
                  <span className="w-2 h-2 rounded-full bg-[#2563EB] mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Practical protocol */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-[#1E3A5F] mb-3">
              Практический протокол для домашнего использования
            </h3>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-[#2563EB] mb-2">1. Подготовка (2 мин)</h4>
                <ul className="space-y-1.5 ml-4">
                  {[
                    'Тихое помещение, телефон без звука.',
                    'Определите цель: например, «снизить тревогу о завтрашнем совещании» (НЕ «переработать детство»).',
                  ].map((item, i) => (
                    <li key={i} className="text-[15px] text-[#374151] leading-relaxed list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#2563EB] mb-2">2. Выполнение (5–7 мин)</h4>
                <ul className="space-y-1.5 ml-4">
                  {[
                    'Оцените уровень дистресса (0–10).',
                    'Используйте технику медленное слежение за онлайн-точкой.',
                    'Во время слежения удерживайте в фокусе текущую тревогу ИЛИ образ безопасного места.',
                    'Делайте паузы каждые 60 секунд. Дышите.',
                    'Финальная оценка дистресса. Если снизился на 2+ балла — техника работает.',
                  ].map((item, i) => (
                    <li key={i} className="text-[15px] text-[#374151] leading-relaxed list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#2563EB] mb-2">3. Завершение</h4>
                <ul className="space-y-1.5 ml-4">
                  {[
                    '«Контейнер» (визуализируйте, как помещаете остаточную тревогу в воображаемый сейф).',
                    'Заземление: назовите 3 предмета в комнате, ощутите опору ногами о пол.',
                  ].map((item, i) => (
                    <li key={i} className="text-[15px] text-[#374151] leading-relaxed list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructionPanel;
