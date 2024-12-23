import { createCli } from '../src';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
  // Validate environment variables
  const requiredEnvVars = ['PTPAPI_APIUSER', 'PTPAPI_APIKEY', 'PTPAPI_PASSKEY'];
  const missingEnvVars = requiredEnvVars.filter(key => !process.env[key]);
  
  if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars.join(', '));
    process.exit(1);
  }

  // Create CLI instance with environment variables
  const cli = createCli({
    apiUser: process.env.PTPAPI_APIUSER!,
    apiKey: process.env.PTPAPI_APIKEY!,
    passKey: process.env.PTPAPI_PASSKEY!
  });

  try {
    // Test basic search
    console.log('\nTesting basic search:');
    await cli.search({ 
      terms: ['Inception'],
      format: 'text',
      filterEmpty: true
    });

    // Test advanced search with parameters
    console.log('\nTesting advanced search:');
    await cli.search({ 
      terms: [
        'year=2010',
        'tags=action',
        'resolution=1080p'
      ],
      format: 'text',
      filterEmpty: true
    });

    // Test JSON output
    console.log('\nTesting JSON output:');
    await cli.search({ 
      terms: ['Matrix'],
      format: 'json',
      filterEmpty: true
    });

    // Test inbox with pagination
    console.log('\nTesting inbox:');
    await cli.inbox({ page: 1 });

  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    } else {
      console.error('Unknown error:', error);
    }
    process.exit(1);
  }
}

// Run with proper error handling
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
