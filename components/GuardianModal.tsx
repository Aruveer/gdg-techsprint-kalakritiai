import React from 'react';
import { Loader, AlertTriangle, CheckCircle } from 'lucide-react';

type GuardianStatus = 'idle' | 'verifying' | 'pass' | 'fail';

interface GuardianModalProps {
  status: GuardianStatus;
  message: string | null;
  onClose: () => void;
}

const statusConfig = {
    verifying: {
        icon: <Loader size={48} className="animate-spin text-brand-maroon" />,
        title: 'Verifying Tradition...',
        defaultMessage: 'Our AI Guardian is checking your description for cultural authenticity.',
        color: 'text-brand-text',
    },
    pass: {
        icon: <CheckCircle size={48} className="text-green-500" />,
        title: 'Verification Complete',
        defaultMessage: 'Your design respects cultural traditions. Proceeding to generate mockup.',
        color: 'text-green-600',
    },
    fail: {
        icon: <AlertTriangle size={48} className="text-red-500" />,
        title: 'Cultural Conflict Detected',
        defaultMessage: 'Please revise your description to align with our community standards.',
        color: 'text-red-600',
    }
};

const GuardianModal: React.FC<GuardianModalProps> = ({ status, message, onClose }) => {
    if (status === 'idle') return null;

    // Use the config for the current status, but only if it's not 'idle'
    const config = statusConfig[status as Exclude<GuardianStatus, 'idle'>];

    return (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={status !== 'verifying' ? onClose : undefined}></div>
            <div className="relative z-10 bg-brand-bg rounded-2xl shadow-2xl w-full max-w-md p-8 text-center animate-fade-in-up">
                <div className="mb-4">{config.icon}</div>
                <h2 className={`text-2xl font-serif font-bold ${config.color}`}>{config.title}</h2>
                <p className="mt-2 text-gray-600">{message || config.defaultMessage}</p>
                {status === 'fail' && (
                     <button 
                        onClick={onClose}
                        className="mt-6 w-full px-6 py-2 bg-brand-maroon text-white text-sm font-semibold rounded-lg hover:bg-brand-maroon-light"
                    >
                        Acknowledge & Revise
                    </button>
                )}
            </div>
        </div>
    );
};

export default GuardianModal;
