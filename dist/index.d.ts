import React from 'react';
import './index.less';
interface PointProps {
    string: number;
    fret: number;
}
interface FingerboardProps {
    data: PointProps[] | PointProps;
    className?: string;
    fretMark?: string | null;
    fretWidth?: number;
}
declare const Fingerboard: React.FC<FingerboardProps>;
export default Fingerboard;
