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
          className="w-48 p-2 bg-black/90 backdrop-blur-sm border-white/20" 
          align="end"
          sideOffset={8}
        >
          <div className="grid grid-cols-2 gap-1">
            {countries.map((country) => (
              <button
                key={country.code}
                onClick={() => {
                  onCountryFilterChange(country.code);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors",
                  "hover:bg-white/10 text-white",
                  countryFilter === country.code && "bg-recipe-primary"
                )}
              >
                <span className="text-sm">{country.flag}</span>
                <span className="text-xs truncate">{country.name}</span>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}