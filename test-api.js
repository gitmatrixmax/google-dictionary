// Simple test script to verify the dictionary API works with images
const axios = require('axios');

async function testDictionary() {
  const word = 'cat';
  try {
    console.log(`Testing dictionary API for word: "${word}"`);
    
    // 1. Test the /api/dictionary endpoint
    console.log('--> Calling /api/dictionary...');
    const dictResponse = await axios.post('http://localhost:4000/api/dictionary', { word });
    
    console.log('✅ Dictionary API Response:');
    console.log('Word:', dictResponse.data.word);
    console.log('Phonetic:', dictResponse.data.phonetic);
    console.log('Meanings found:', dictResponse.data.meanings?.length || 0);

    if (!dictResponse.data.meanings || dictResponse.data.meanings.length === 0) {
        throw new Error('Dictionary API did not return any meanings.');
    }

    // 2. Test the /api/images endpoint
    console.log('\n--> Calling /api/images...');
    const imagesResponse = await axios.post('http://localhost:4000/api/images', { word });

    console.log('✅ Images API Response:');
    console.log('Images found:', imagesResponse.data.images?.length || 0);

    if (imagesResponse.data.images?.length > 0) {
      console.log('First image URL:', imagesResponse.data.images[0].url);
    } else {
      console.log('No images returned, which might be expected depending on the word and API keys.');
    }

    console.log('\n✅ All API endpoints tested successfully!');

  } catch (error) {
    console.error('❌ Test Failed:', error.message);
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
    }
  }
}

testDictionary();