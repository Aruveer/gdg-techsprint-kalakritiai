import React from 'react';
import type { ChartData } from '../types';

/**
 * Generates the SVG path data for a donut chart segment.
 * @param cx - Center x-coordinate.
 * @param cy - Center y-coordinate.
 * @param innerRadius - The inner radius of the donut.
 * @param outerRadius - The outer radius of the donut.
 * @param startAngle - The starting angle in radians.
 * @param endAngle - The ending angle in radians.
 * @returns An object containing the SVG path string and a flag if it's a full circle.
 */
const getDonutSegmentPath = (
    cx: number, cy: number, 
    innerRadius: number, outerRadius: number, 
    startAngle: number, endAngle: number
): { path: string; isFullCircle: boolean } => {
    const isFullCircle = endAngle - startAngle >= 2 * Math.PI - 0.001;

    if (isFullCircle) {
        // Path for a full ring. Uses two half-arcs for the outer and inner circles.
        const path = [
            `M ${cx} ${cy - outerRadius}`,
            `A ${outerRadius} ${outerRadius} 0 0 1 ${cx} ${cy + outerRadius}`,
            `A ${outerRadius} ${outerRadius} 0 0 1 ${cx} ${cy - outerRadius}`,
            `M ${cx} ${cy - innerRadius}`,
            `A ${innerRadius} ${innerRadius} 0 0 0 ${cx} ${cy + innerRadius}`,
            `A ${innerRadius} ${innerRadius} 0 0 0 ${cx} ${cy - innerRadius}`,
            `Z`
        ].join(' ');
        return { path, isFullCircle: true };
    }

    const startOuter = { x: cx + outerRadius * Math.cos(startAngle), y: cy + outerRadius * Math.sin(startAngle) };
    const endOuter = { x: cx + outerRadius * Math.cos(endAngle), y: cy + outerRadius * Math.sin(endAngle) };
    const startInner = { x: cx + innerRadius * Math.cos(startAngle), y: cy + innerRadius * Math.sin(startAngle) };
    const endInner = { x: cx + innerRadius * Math.cos(endAngle), y: cy + innerRadius * Math.sin(endAngle) };

    const largeArcFlag = endAngle - startAngle <= Math.PI ? '0' : '1';
    
    const path = [
        `M ${startOuter.x} ${startOuter.y}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}`,
        `L ${endInner.x} ${endInner.y}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${startInner.x} ${startInner.y}`,
        'Z'
    ].join(' ');

    return { path, isFullCircle: false };
};

const MonthlyOrdersChart: React.FC<{ data: ChartData }> = ({ data }) => {
    const totalCompleted = data.completed_orders.reduce((sum, a) => sum + a, 0);
    const totalPending = data.pending_orders.reduce((sum, a) => sum + a, 0);
    const totalOrders = totalCompleted + totalPending;

    if (totalOrders === 0) {
        return <div className="text-center text-gray-500">No order data to display.</div>;
    }

    const completedPercentage = (totalCompleted / totalOrders) * 100;
    const pendingPercentage = (totalPending / totalOrders) * 100;

    const completedAngle = (completedPercentage / 100) * 2 * Math.PI;
    const pendingAngle = (pendingPercentage / 100) * 2 * Math.PI;

    const startAngleCompleted = -Math.PI / 2;
    const endAngleCompleted = startAngleCompleted + completedAngle;
    const startAnglePending = endAngleCompleted;
    const endAnglePending = startAnglePending + pendingAngle;
    
    // Config
    const outerRadius = 90;
    const innerRadius = 50;
    const centerX = 125;
    const centerY = 125;
    const shadowOffset = 4;
    const strokeWidth = 3;

    // New color palette
    const colors = {
        completed: { main: '#14B8A6', shadow: '#0F766E' }, // teal-500, teal-700
        pending: { main: '#F59E0B', shadow: '#B45309' }, // amber-500, amber-700
    };

    const completedSegment = getDonutSegmentPath(centerX, centerY, innerRadius, outerRadius, startAngleCompleted, endAngleCompleted);
    const pendingSegment = getDonutSegmentPath(centerX, centerY, innerRadius, outerRadius, startAnglePending, endAnglePending);

    return (
        <div className="w-full h-full font-sans flex flex-col items-center justify-center">
            <svg width="250" height="250" viewBox="0 0 250 250">
                <g>
                    {/* Shadow/Extrusion Layer */}
                    {totalCompleted > 0 && <path d={completedSegment.path} fill={colors.completed.shadow} transform={`translate(0, ${shadowOffset})`} />}
                    {totalPending > 0 && <path d={pendingSegment.path} fill={colors.pending.shadow} transform={`translate(0, ${shadowOffset})`} />}
                    
                    {/* Main Layer with Separator Strokes */}
                    {totalCompleted > 0 && <path d={completedSegment.path} fill={colors.completed.main} stroke="#FFFFFF" strokeWidth={strokeWidth} fillRule={completedSegment.isFullCircle ? "evenodd" : "nonzero"} />}
                    {totalPending > 0 && <path d={pendingSegment.path} fill={colors.pending.main} stroke="#FFFFFF" strokeWidth={strokeWidth} fillRule={pendingSegment.isFullCircle ? "evenodd" : "nonzero"} />}
                </g>
                <g className="text-center">
                    <text x={centerX} y={centerY - 5} textAnchor="middle" className="text-3xl font-bold fill-current text-brand-text">{totalOrders}</text>
                    <text x={centerX} y={centerY + 15} textAnchor="middle" className="text-sm fill-current text-gray-500">Total Orders</text>
                </g>
            </svg>
            <div className="flex justify-center gap-6 mt-4 text-sm">
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors.completed.main }}></div>
                        <span className="font-semibold">Completed</span>
                    </div>
                    <span className="text-gray-600">{totalCompleted} ({completedPercentage.toFixed(0)}%)</span>
                </div>
                <div className="flex flex-col items-center">
                     <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors.pending.main }}></div>
                        <span className="font-semibold">Pending</span>
                    </div>
                     <span className="text-gray-600">{totalPending} ({pendingPercentage.toFixed(0)}%)</span>
                </div>
            </div>
        </div>
    );
};

export default MonthlyOrdersChart;
