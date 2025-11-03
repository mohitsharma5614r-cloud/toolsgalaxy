
import React from 'react';
import { EmiCalculator } from './EmiCalculator'; // Reusing the core logic

// FIX: Add title prop to the component
export const CarLoanEmiTool: React.FC<{ title: string }> = ({ title }) => {
    return (
        <div>
            {/* FIX: Pass title prop to EmiCalculator */}
            <EmiCalculator title={title} />
        </div>
    );
};
