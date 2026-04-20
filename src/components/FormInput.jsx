import React from 'react';

const FormInput = ({ label, value, onChange, placeholder, type = "text", multiline = false }) => {
    const InputComponent = multiline ? 'textarea' : 'input';

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-white/70 mb-1">{label}</label>
            <InputComponent
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white/10 outline-none transition-all"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                type={type}
                rows={multiline ? 4 : undefined}
            />
        </div>
    );
};

export default FormInput;
