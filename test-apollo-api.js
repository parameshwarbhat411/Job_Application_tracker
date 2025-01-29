// Test 1: Basic Search
const basicSearchBody = {
  q_organization_domains: ["microsoft.com"],  // Target company domain
  person_titles: ["recruiter"],  // Just one title to test
  page: 1,
  per_page: 25
};

// Test 2: Comprehensive Search
const comprehensiveSearchBody = {
  person_titles: [
    "recruiter",
    "talent acquisition",
    "recruiting",
    "technical recruiter"
  ],
  person_locations: ["united states"],  // Add location filter
  organization_locations: ["united states"],  // Company location
  q_organization_domains: ["microsoft.com"],
  contact_email_status: ["verified", "likely to engage"],  // Only get contactable people
  page: 1,
  per_page: 25
};

// API Configuration
const config = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'X-Api-Key': 'YOUR_API_KEY_HERE'  // Replace with your Apollo API key
  }
};

// Test Basic Search
async function testBasicSearch() {
  try {
    console.log('Testing basic search with body:', JSON.stringify(basicSearchBody, null, 2));
    const response = await fetch('https://api.apollo.io/v1/mixed_people/search', {
      ...config,
      body: JSON.stringify(basicSearchBody)
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Basic search error:', error);
    throw error;
  }
}

// Test Comprehensive Search
async function testComprehensiveSearch() {
  try {
    console.log('Testing comprehensive search with body:', JSON.stringify(comprehensiveSearchBody, null, 2));
    const response = await fetch('https://api.apollo.io/v1/mixed_people/search', {
      ...config,
      body: JSON.stringify(comprehensiveSearchBody)
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Comprehensive search error:', error);
    throw error;
  }
}

// Run tests
async function runTests() {
  console.log('Running Basic Search Test...');
  const basicResults = await testBasicSearch();
  console.log('Basic search results:', JSON.stringify(basicResults, null, 2));

  console.log('\nRunning Comprehensive Search Test...');
  const comprehensiveResults = await testComprehensiveSearch();
  console.log('Comprehensive search results:', JSON.stringify(comprehensiveResults, null, 2));
}

// Run the tests
runTests().catch(console.error);