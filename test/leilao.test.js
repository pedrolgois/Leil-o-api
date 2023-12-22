const request = require('supertest');

import { GET, POST } from './api'

describe('GET /api', () => {
    test('retorna uma resposta JSON com a lista de itens', async () => {
      const response = await GET();
      expect(Array.isArray(response)).toBe(true);
    });
  });

describe('POST /api', () => {
    test('retorna uma resposta JSON com a lista de itens', async () => {
        const response = await POST();
        expect(response).toBe("ok");
    });
});