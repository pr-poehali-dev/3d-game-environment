import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface GameUIProps {
  isLocked: boolean;
  gameTime: { hours: number; minutes: number };
  money: number;
  onStartGame: () => void;
}

export const GameUI = ({ isLocked, gameTime, money, onStartGame }: GameUIProps) => {
  return (
    <>
      {isLocked && (
        <>
          <div className="absolute top-2 left-2">
            <Card className="p-2 bg-[#1A1F2C]/95 border-[#10b981]">
              <div className="flex items-center gap-2">
                <div className="relative w-6 h-6">
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
                <span className="text-white font-mono text-base font-bold">
                  {Math.floor(money).toLocaleString()}
                </span>
              </div>
            </Card>
          </div>

          <div className="absolute top-2 right-2">
            <Card className="p-2 bg-[#1A1F2C]/95 border-[#9b87f5]">
              <div className="flex items-center gap-1">
                <Icon name="Clock" size={16} className="text-[#9b87f5]" />
                <span className="text-white font-mono text-sm">
                  {String(gameTime.hours).padStart(2, '0')}:{String(gameTime.minutes).padStart(2, '0')}
                </span>
              </div>
            </Card>
          </div>

          <div className="absolute top-14 left-1/2 transform -translate-x-1/2">
            <Card className="px-3 py-1 bg-[#1A1F2C]/60 border-[#9b87f5]/30">
              <p className="text-white text-xs text-center">Правая часть экрана - осмотр</p>
            </Card>
          </div>
        </>
      )}

      {!isLocked && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 w-full max-w-md">
          <Card className="p-6 bg-[#1A1F2C]/95 border-[#9b87f5]">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-white">🏢 OZON Симулятор ПВЗ</h2>
              <div className="text-sm text-gray-400 space-y-2">
                <div className="bg-[#9b87f5]/20 rounded p-2">
                  <p className="font-semibold text-[#9b87f5]">🕹️ Джойстик слева</p>
                  <p className="text-xs">Движение персонажа</p>
                </div>
                <div className="bg-[#9b87f5]/20 rounded p-2">
                  <p className="font-semibold text-[#9b87f5]">👆 Свайп справа</p>
                  <p className="text-xs">Осмотр вокруг</p>
                </div>
              </div>
              <Button 
                onClick={onStartGame}
                className="w-full bg-[#9b87f5] hover:bg-[#8b77e5] text-white font-bold py-3 text-lg"
              >
                Начать
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};