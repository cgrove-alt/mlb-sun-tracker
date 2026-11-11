/** @jest-environment node */
// The GA startup script must set Consent Mode defaults from the visitor's
// saved cookie choice before it sends the first pageview. The cookie banner
// loads later, so a default of "granted" sent an opted-out visitor's first
// pageview as granted.
import vm from 'vm';
import { gaInitScript } from '../GoogleAnalyticsLazy';

type Setup = { saved?: object; gpc?: boolean; storageThrows?: boolean };

function run({ saved, gpc = false, storageThrows = false }: Setup) {
  const localStorage = {
    getItem(key: string) {
      if (storageThrows) throw new Error('storage blocked');
      return key === 'cookie_consent' && saved ? JSON.stringify(saved) : null;
    },
  };
  const context: Record<string, unknown> = { localStorage, navigator: { globalPrivacyControl: gpc } };
  context.window = context;
  vm.runInNewContext(gaInitScript('G-TEST'), context);
  const commands = (context.dataLayer as IArguments[]).map((args) => Array.from(args));
  return commands;
}

function consentDefault(setup: Setup) {
  const commands = run(setup);
  const consent = commands.find((c) => c[0] === 'consent' && c[1] === 'default');
  return consent?.[2] as Record<string, string>;
}

describe('GA consent defaults', () => {
  it('denies analytics for a visitor who opted out', () => {
    const consent = consentDefault({ saved: { necessary: true, performance: false, functional: false } });
    expect(consent.analytics_storage).toBe('denied');
    expect(consent.functionality_storage).toBe('denied');
  });

  it('grants analytics for a visitor who accepted, even with GPC on', () => {
    const consent = consentDefault({ saved: { necessary: true, performance: true, functional: true }, gpc: true });
    expect(consent.analytics_storage).toBe('granted');
  });

  it('denies analytics when there is no saved choice and GPC is on', () => {
    expect(consentDefault({ gpc: true }).analytics_storage).toBe('denied');
  });

  it('grants analytics when there is no saved choice and no GPC', () => {
    expect(consentDefault({}).analytics_storage).toBe('granted');
  });

  it('denies analytics when storage cannot be read', () => {
    expect(consentDefault({ storageThrows: true }).analytics_storage).toBe('denied');
  });

  it('always denies ads', () => {
    const consent = consentDefault({ saved: { performance: true, functional: true } });
    expect(consent.ad_storage).toBe('denied');
    expect(consent.ad_user_data).toBe('denied');
    expect(consent.ad_personalization).toBe('denied');
  });

  it('sets consent before the config command that sends the first pageview', () => {
    const commands = run({});
    const consentAt = commands.findIndex((c) => c[0] === 'consent');
    const configAt = commands.findIndex((c) => c[0] === 'config');
    expect(consentAt).toBeGreaterThanOrEqual(0);
    expect(configAt).toBeGreaterThan(consentAt);
    expect(commands[configAt][1]).toBe('G-TEST');
  });
});
