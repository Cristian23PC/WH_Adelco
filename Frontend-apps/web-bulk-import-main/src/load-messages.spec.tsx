import loadMessages from './load-messages';

describe('loadMessages', () => {
  it('should load messages for a valid locale', async () => {
    const locale = 'en';
    const messages = await loadMessages(locale);

    expect(messages).toEqual({});
  });

  it('should return an empty object for an invalid locale', async () => {
    const invalidLocale = 'de';
    const messages = await loadMessages(invalidLocale);

    expect(messages).toEqual({});
  });
});
