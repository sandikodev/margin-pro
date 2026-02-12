
import React from 'react';
import { AcademyView as AcademyComponent } from './academy/_components/AcademyView';

interface AcademyViewProps {
  onOpenAbout?: () => void;
}

export const AcademyView: React.FC<AcademyViewProps> = (props) => {
  return <AcademyComponent {...props} />;
};
