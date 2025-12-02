import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: ReactNode;
}

export const CardHeader = ({ children }: CardHeaderProps) => {
  return <div className="px-6 py-4 border-b border-gray-200">{children}</div>;
};

interface CardTitleProps {
  children: ReactNode;
}

export const CardTitle = ({ children }: CardTitleProps) => {
  return <h3 className="text-lg font-semibold text-gray-900">{children}</h3>;
};

interface CardContentProps {
  children: ReactNode;
}

export const CardContent = ({ children }: CardContentProps) => {
  return <div className="px-6 py-4">{children}</div>;
};
