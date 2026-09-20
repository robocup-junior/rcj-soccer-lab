import { SimulatorApp } from '@/components/simulator/SimulatorApp';
import { LocalizationProvider } from '@/components/i18n/LocalizationProvider';
import { AccountProvider } from '@/components/account';
import { RulesetProvider } from '@/components/rulesets/RulesetProvider';

export const dynamic = 'force-static';

export default function Home() {
  return (
    <LocalizationProvider>
      <RulesetProvider>
        <AccountProvider>
          <SimulatorApp />
        </AccountProvider>
      </RulesetProvider>
    </LocalizationProvider>
  );
}
