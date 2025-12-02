import React from 'react';

export const Container = ({ children, className = '', size = 'default' }) => {
  const sizeClasses = {
    sm: 'max-w-3xl',
    default: 'max-w-7xl',
    lg: 'max-w-full',
    mobile: 'max-w-md'
  };
  
  return (
    <div className={`w-full ${sizeClasses[size]} mx-auto px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
};

export const Grid = ({ children, cols = 1, className = '', gap = 'default' }) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 xs:grid-cols-2',
    3: 'grid-cols-1 xs:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
  };
  
  const gapClasses = {
    sm: 'gap-2 sm:gap-3',
    default: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8'
  };
  
  return (
    <div className={`grid ${gridCols[cols]} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
};

export const Stack = ({ children, spacing = 'md', className = '' }) => {
  const spacingClasses = {
    xs: 'space-y-1',
    sm: 'space-y-2 sm:space-y-3',
    md: 'space-y-3 sm:space-y-4 lg:space-y-6',
    lg: 'space-y-4 sm:space-y-6 lg:space-y-8',
    xl: 'space-y-6 sm:space-y-8 lg:space-y-10'
  };
  
  return (
    <div className={`${spacingClasses[spacing]} ${className}`}>
      {children}
    </div>
  );
};

export const Flex = ({ children, direction = 'row', align = 'start', justify = 'start', wrap = false, className = '', responsive = false }) => {
  const directionClass = responsive 
    ? 'flex-col sm:flex-row' 
    : direction === 'col' ? 'flex-col' : 'flex-row';
    
  const alignClass = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  }[align];
  
  const justifyClass = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  }[justify];
  
  const wrapClass = wrap ? 'flex-wrap' : '';
  
  return (
    <div className={`flex ${directionClass} ${alignClass} ${justifyClass} ${wrapClass} ${className}`}>
      {children}
    </div>
  );
};

// New responsive components
export const ResponsiveSection = ({ children, className = '', padding = 'default' }) => {
  const paddingClasses = {
    none: '',
    sm: 'py-4 sm:py-6',
    default: 'py-6 sm:py-8 lg:py-12',
    lg: 'py-8 sm:py-12 lg:py-16'
  };
  
  return (
    <section className={`${paddingClasses[padding]} ${className}`}>
      {children}
    </section>
  );
};

export const ResponsiveText = ({ children, size = 'base', className = '' }) => {
  const sizeClasses = {
    xs: 'text-xs sm:text-sm',
    sm: 'text-sm sm:text-base',
    base: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl lg:text-2xl',
    xl: 'text-xl sm:text-2xl lg:text-3xl',
    '2xl': 'text-2xl sm:text-3xl lg:text-4xl',
    '3xl': 'text-3xl sm:text-4xl lg:text-5xl'
  };
  
  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
};