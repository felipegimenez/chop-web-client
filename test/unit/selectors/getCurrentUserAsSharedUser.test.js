import { getCurrentUserAsSharedUser } from '../../../src/users/dux';

describe('getCurrentUserAsSharedUser', () => {
  test('It removes the permissions and pubnubAccessKey', () => {
    const state = {
      currentUser: {
        id: 12345,
        pubnubToken: '09876',
        pubnubAccessKey: '67890',
        avatar: null,
        name: 'Joan Jet',
        role: {
          label: '',
          permissions: ['global.admin'],
        },
        preferences: {
          textMode: 'COMPACT',
        },
      },
    };

    expect(getCurrentUserAsSharedUser(state)).toEqual({
      id: 12345,
      pubnubToken: '09876',
      avatar: null,
      name: 'Joan Jet',
      role: {
        label: '',
      },
    });
  });
});
