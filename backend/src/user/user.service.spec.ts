
import { UserService } from './user.service';

describe('UserService (unit)', () => {
  let service: UserService;
  let prismaMock: any;

  beforeEach(() => {
    prismaMock = {
      user: {
        update: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
      },
    };
    service = new UserService(prismaMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('updateUser should call prisma.user.update with correct args', async () => {
    prismaMock.user.update.mockResolvedValue({ id: '1', name: 'Test' });
    const patch = { name: 'Test' };
    const result = await service.updateUser('1', patch);
    expect(prismaMock.user.update).toHaveBeenCalledWith({ where: { id: '1' }, data: patch });
    expect(result).toEqual({ id: '1', name: 'Test' });
  });

  it('getUser should call prisma.user.findUnique', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: '1', name: 'Test' });
    const result = await service.getUser('1');
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(result).toEqual({ id: '1', name: 'Test' });
  });

  it('getUserByEmail should call prisma.user.findFirst', async () => {
    prismaMock.user.findFirst.mockResolvedValue({ id: '1', email: 'a@b.com' });
    const result = await service.getUserByEmail('a@b.com');
    expect(prismaMock.user.findFirst).toHaveBeenCalledWith({ where: { email: 'a@b.com' } });
    expect(result).toEqual({ id: '1', email: 'a@b.com' });
  });

  it('filterUserFields returns null if user is null', () => {
    const result = service.filterUserFields(null, 'user');
    expect(result).toBeNull();
  });

  it('filterUserFields returns only allowed fields for user role', () => {
    // Simulate userFieldConfig and a user object
    (service as any).userFieldConfig = {
      id: { readableFor: ['user', 'admin'] },
      email: { readableFor: ['admin'] },
    };
    const user = { id: '1', email: 'a@b.com', name: 'Test' };
    // Patch method to use the mock config
    const origConfig = (service as any).userFieldConfig;
    (service as any).userFieldConfig = {
      id: { readableFor: ['user', 'admin'] },
      email: { readableFor: ['admin'] },
    };
    const filtered = service.filterUserFields(user, 'user');
    expect(filtered).toHaveProperty('id', '1');
    expect(filtered).not.toHaveProperty('email');
    (service as any).userFieldConfig = origConfig;
  });

  // Add more cases as needed for edge cases, errors, etc.
});