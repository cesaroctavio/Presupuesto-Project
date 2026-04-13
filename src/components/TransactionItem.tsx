import React, { useRef, useState, useEffect } from 'react';
import { ICONS, formatMoney } from '../data';
import { useSwipeable } from 'react-swipeable';
import { Trash2, Edit2 } from 'lucide-react';

export default function TransactionItem({ item, onDelete, onEdit }: any) {
  const iconInfo = ICONS[item.type as keyof typeof ICONS] || { icon: 'fa-box', variant: 'expense' };
  const isIncome = item.type === 'ingresos';
  
  const [swipedLeft, setSwipedLeft] = useState(false);

  // Swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: () => setSwipedLeft(true),
    onSwipedRight: () => setSwipedLeft(false),
    trackMouse: true, // helps on desktop testing
  });

  // Long press logic
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleTouchStart = () => {
    timerRef.current = setTimeout(() => {
      onEdit(item);
    }, 600); // 600ms for long press
  };

  const handleTouchEnd = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  // Close swipe on outside click
  useEffect(() => {
    if (!swipedLeft) return;
    const hide = () => setSwipedLeft(false);
    window.addEventListener('click', hide);
    return () => window.removeEventListener('click', hide);
  }, [swipedLeft]);

  return (
    <div 
      className="relative w-full overflow-hidden rounded-xl mb-3 border border-transparent"
      {...handlers}
    >
      {/* Background Actions (revealed on swipe) */}
      <div className="absolute inset-y-0 right-0 flex max-w-[120px] w-full">
        <button 
          onClick={(e) => { e.stopPropagation(); onEdit(item); setSwipedLeft(false); }}
          className="flex-1 bg-blue-500 flex items-center justify-center text-white"
        >
          <Edit2 size={18} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(item.id); setSwipedLeft(false); }}
          className="flex-1 bg-red-500 flex items-center justify-center text-white"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Foreground Item */}
      <div 
        className={`transaction-item relative bg-[#2a2d36] transition-transform duration-300 ease-out z-10 !mb-0 !rounded-none !border-0 ${swipedLeft ? '-translate-x-[120px]' : 'translate-x-0'}`}
        onPointerDown={handleTouchStart}
        onPointerUp={handleTouchEnd}
        onPointerLeave={handleTouchEnd}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="item-info">
          <div className={`item-icon ${iconInfo.variant}`}>
            <i className={`fas ${iconInfo.icon}`}></i>
          </div>
          <div className="item-details">
            <p className="!text-sm md:!text-base">{item.concept}</p>
            <span>Quincena {item.quincena}</span>
          </div>
        </div>
        <div className="item-right">
          <div className="item-amount">
            {isIncome ? '+' : '-'}{formatMoney(item.amount)}
          </div>
        </div>
      </div>
    </div>
  );
}
