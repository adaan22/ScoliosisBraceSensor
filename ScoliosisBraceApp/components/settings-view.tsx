import { DeviceTokenSection } from '@/components/device-token-section';

export function SettingsView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#00487C]">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Device authentication and sensor script setup</p>
      </div>
      <DeviceTokenSection />
    </div>
  );
}
