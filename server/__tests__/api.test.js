const request = require('supertest');
const express = require('express');
const axios = require('axios');
const path = require('path');

// Mock the entire axios module
jest.mock('axios');

// We need to import the app logic after mocking axios
const serverApp = require('../app'); 

describe('Dictionary API Endpoints', () => {

  afterEach(() => {
    // Clear all mocks after each test
    jest.clearAllMocks();
  });

  describe('POST /api/dictionary', () => {
    it('should return dictionary data for a valid word', async () => {
      // Mock the successful response from the dictionary API
      const mockApiResponse = {
        data: [{
          word: 'test',
          phonetic: '/tɛst/',
          meanings: [{
            partOfSpeech: 'noun',
            definitions: [{
              definition: 'A procedure intended to establish the quality, performance, or reliability of something.',
              example: 'this is a test of the system'
            }]
          }]
        }]
      };
      axios.get.mockResolvedValue(mockApiResponse);

      const response = await request(serverApp)
        .post('/api/dictionary')
        .send({ word: 'test' });

      expect(response.statusCode).toBe(200);
      expect(response.body.word).toBe('test');
      expect(response.body.phonetic).toBe('/tɛst/');
      expect(response.body.meanings).toBeInstanceOf(Array);
      expect(response.body.meanings[0].partOfSpeech).toBe('noun');
    });

    it('should return 400 if word is not provided', async () => {
      const response = await request(serverApp)
        .post('/api/dictionary')
        .send({});

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('Missing word in body');
    });

    it('should return 500 on API failure', async () => {
      // Mock a failed API call
      axios.get.mockRejectedValue(new Error('API is down'));

      const response = await request(serverApp)
        .post('/api/dictionary')
        .send({ word: 'fail' });

      expect(response.statusCode).toBe(500);
      expect(response.body.error).toBe('Dictionary lookup failed');
    });
  });

  describe('POST /api/images', () => {
    it('should return image data for a valid word', async () => {
      // Mock the successful response from the Google Images API
      const mockImageResponse = {
        data: {
          items: [{
            link: 'http://example.com/image.jpg',
            title: 'A test image',
            image: {
              contextLink: 'http://example.com',
              thumbnailLink: 'http://example.com/thumb.jpg'
            }
          }]
        }
      };
      axios.get.mockResolvedValue(mockImageResponse);

      const response = await request(serverApp)
        .post('/api/images')
        .send({ word: 'test' });

      expect(response.statusCode).toBe(200);
      expect(response.body.images).toBeInstanceOf(Array);
      expect(response.body.images.length).toBe(1);
      expect(response.body.images[0].url).toBe('http://example.com/image.jpg');
    });

    it('should return 400 if word is not provided', async () => {
      const response = await request(serverApp)
        .post('/api/images')
        .send({});

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('Missing word in body');
    });
  });

  describe('GET /api/health', () => {
    it('should return { ok: true }', async () => {
        const response = await request(serverApp).get('/api/health');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ ok: true });
    });
  });
});
