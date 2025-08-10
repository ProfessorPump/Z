import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export type CountryFilter = 'all' | string;

interface CountryFilterProps {
  countryFilter: CountryFilter;
  onCountryFilterChange: (filter: CountryFilter) => void;
}

const countries = [
  { code: 'all', name: 'All', flag: '🏳️' },
  { code: 'italy', name: 'Italy', flag: '🇮🇹' },
  { code: 'france', name: 'France', flag: '🇫🇷' },
  { code: 'usa', name: 'USA', flag: '🇺🇸' },
  { code: 'japan', name: 'Japan', flag: '🇯🇵' },
  { code: 'india', name: 'India', flag: '🇮🇳' },
  { code: 'mexico', name: 'Mexico', flag: '🇲🇽' },
  { code: 'china', name: 'China', flag: '🇨🇳' },
  { code: 'spain', name: 'Spain', flag: '🇪🇸' },
  { code: 'thailand', name: 'Thailand', flag: '🇹🇭' },
];

export function CountryFilter({ countryFilter, onCountryFilterChange }: CountryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedCountry = countries.find(country => country.code === countryFilter) || countries[0];

  return (
    <div className="absolute top-6 right-6 z-30">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "bg-black/30 backdrop-blur-sm border-white/30 text-white text-xs",
              "hover:bg-white/20 h-10 w-10 p-0"
            )}
          >
            <span className="text-lg">{selectedCountry.flag}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-64 h-64 p-4 bg-black/90 backdrop-blur-sm border-white/20 rounded-full" 
          align="end"
          sideOffset={8}
        >
          <div className="relative w-full h-full">
            {/* Center "All" button */}
            <button
              onClick={() => {
                onCountryFilterChange('all');
                setIsOpen(false);
              }}
              className={cn(
                "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
                "w-12 h-12 rounded-full flex items-center justify-center",
                "transition-colors text-lg",
                "hover:bg-white/10 text-white",
                countryFilter === 'all' && "bg-recipe-primary"
              )}
            >
              🏳️
            </button>
            
            {/* Country flags arranged in a circle */}
            {countries.slice(1).map((country, index) => {
              const angle = (index * 360) / (countries.length - 1);
              const radius = 80;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;
              
              return (
                <button
                  key={country.code}
                  onClick={() => {
                    onCountryFilterChange(country.code);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "absolute w-10 h-10 rounded-full flex items-center justify-center",
                    "transition-all duration-200 text-sm",
                    "hover:bg-white/10 text-white hover:scale-110",
                    countryFilter === country.code && "bg-recipe-primary scale-110"
                  )}
                  style={{
                    left: `calc(50% + ${x}px - 20px)`,
                    top: `calc(50% + ${y}px - 20px)`,
                  }}
                  title={country.name}
                >
                  {country.flag}
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}