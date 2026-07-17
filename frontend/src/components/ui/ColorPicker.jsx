import { useState } from "react";
import { Check, Pipette } from "lucide-react";
import useTheme from "../../hooks/useTheme";

export default function ColorPicker() {
  const { accent, setAccent, accentPresets } = useTheme();
  const [customColor, setCustomColor] = useState(accent);
  const [showCustom, setShowCustom] = useState(false);

  const handleCustomChange = (e) => {
    const val = e.target.value;
    setCustomColor(val);
    if (/^#[0-9a-fA-F]{6}$/.test(val)) {
      setAccent(val);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
        Accent Color
      </p>

      {/* Preset Grid */}
      <div className="flex flex-wrap gap-2">
        {accentPresets.map((preset) => (
          <button
            key={preset.value}
            onClick={() => setAccent(preset.value)}
            className="relative w-7 h-7 rounded-full transition-transform hover:scale-110"
            style={{ backgroundColor: preset.value }}
            title={preset.name}
            aria-label={`${preset.name} accent color`}
          >
            {accent === preset.value && (
              <span className="absolute inset-0 flex items-center justify-center">
                <Check size={14} className="text-white" strokeWidth={3} />
              </span>
            )}
          </button>
        ))}

        {/* Custom Color Button */}
        <button
          onClick={() => setShowCustom(!showCustom)}
          className="w-7 h-7 rounded-full border-2 border-dashed border-[var(--border-strong)] flex items-center justify-center hover:border-[var(--text-tertiary)] transition-colors"
          title="Custom color"
          aria-label="Pick custom accent color"
        >
          <Pipette size={12} className="text-[var(--text-tertiary)]" />
        </button>
      </div>

      {/* Custom Color Input */}
      {showCustom && (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={customColor}
            onChange={handleCustomChange}
            className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent p-0"
            aria-label="Custom accent color"
          />
          <input
            type="text"
            value={customColor}
            onChange={(e) => {
              setCustomColor(e.target.value);
              if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) {
                setAccent(e.target.value);
              }
            }}
            placeholder="#6366f1"
            className="flex-1 px-2.5 py-1.5 rounded-md bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)] text-[12px] font-mono focus:outline-none focus:border-[var(--accent)]"
          />
        </div>
      )}
    </div>
  );
}
