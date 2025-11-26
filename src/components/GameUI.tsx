import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface GameUIProps {
  isLocked: boolean;
  selectedObject: string | null;
  gameTime: { hours: number; minutes: number };
  money: number;
  isMobile: boolean;
}

export const GameUI = ({ isLocked, selectedObject, gameTime, money, isMobile }: GameUIProps) => {
  return (
    <>
      {isLocked && (
        <>
          <div className={`absolute ${isMobile ? 'top-2 left-2' : 'top-4 left-4'}`}>
            <Card className={`${isMobile ? 'p-2' : 'p-3'} bg-[#1A1F2C]/95 border-[#10b981]`}>
              <div className={`flex items-center ${isMobile ? 'gap-2' : 'gap-3'}`}>
                <div className={`relative ${isMobile ? 'w-6 h-6' : 'w-8 h-8'}`}>
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path
                      d="M20 80 Q20 40 40 40 L40 60 Q40 70 50 70 L70 70 Q80 70 80 60 L80 30 L60 50"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M40 20 L80 60"
                      fill="none"
                      stroke="#14b8a6"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <span className={`text-white font-mono ${isMobile ? 'text-base' : 'text-xl'} font-bold`}>
                  {Math.floor(money).toLocaleString()}
                </span>
              </div>
            </Card>
          </div>

          <div className={`absolute ${isMobile ? 'top-2 right-2' : 'top-4 right-4'}`}>
            <Card className={`${isMobile ? 'p-2' : 'p-3'} bg-[#1A1F2C]/95 border-[#9b87f5]`}>
              <div className={`flex items-center ${isMobile ? 'gap-1' : 'gap-2'}`}>
                <Icon name="Clock" size={isMobile ? 16 : 20} className="text-[#9b87f5]" />
                <span className={`text-white font-mono ${isMobile ? 'text-sm' : 'text-lg'}`}>
                  {String(gameTime.hours).padStart(2, '0')}:{String(gameTime.minutes).padStart(2, '0')}
                </span>
              </div>
            </Card>
          </div>

          {isMobile && (
            <div className="absolute top-2 right-1/2 transform translate-x-1/2">
              <Card className="px-3 py-1 bg-[#1A1F2C]/80 border-[#9b87f5]/50">
                <p className="text-white text-xs">Правая часть экрана - осмотр</p>
              </Card>
            </div>
          )}
        </>
      )}

      {!isLocked && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 w-full max-w-md">
          <Card className={`${isMobile ? 'p-4' : 'p-6'} bg-[#1A1F2C]/95 border-[#9b87f5]`}>
            <div className="text-center space-y-4">
              <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-white`}>OZON Симулятор ПВЗ</h2>
              <p className={`text-gray-300 ${isMobile ? 'text-sm' : ''}`}>
                {isMobile ? 'Нажмите на экран' : 'Нажмите, чтобы начать'}
              </p>
              <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-400 space-y-1`}>
                {isMobile ? (
                  <>
                    <p>Джойстик слева - движение</p>
                    <p>Свайп справа - осмотр</p>
                  </>
                ) : (
                  <>
                    <p>WASD - движение</p>
                    <p>Мышь - осмотр</p>
                  </>
                )}
                <p>ESC - выход</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {selectedObject && isLocked && !isMobile && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <Card className="p-3 bg-[#1A1F2C]/95 border-[#9b87f5]">
            <p className="text-white font-medium">{selectedObject}</p>
          </Card>
        </div>
      )}
    </>
  );
};