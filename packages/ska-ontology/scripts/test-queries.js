#!/usr/bin/env node
/**
 * Test SKA SPARQL Queries
 * Validates query syntax and optionally executes against a SPARQL endpoint
 */

const fs = require('fs');
const path = require('path');

const QUERIES_DIR = path.join(__dirname, '..', 'queries');
const SPARQL_ENDPOINT = process.env.SPARQL_ENDPOINT || 'http://localhost:3030/jade/sparql';

async function validateQuerySyntax(queryFile) {
  const content = fs.readFileSync(queryFile, 'utf-8');
  
  // Basic syntax checks
  const hasPrefix = content.includes('PREFIX');
  const hasSelect = content.includes('SELECT') || content.includes('CONSTRUCT') || content.includes('ASK');
  const hasWhere = content.includes('WHERE');
  
  if (!hasPrefix) {
    console.warn(`  ⚠️  No PREFIX declarations found`);
  }
  if (!hasSelect) {
    console.warn(`  ⚠️  No query type (SELECT/CONSTRUCT/ASK) found`);
  }
  if (!hasWhere) {
    console.warn(`  ⚠️  No WHERE clause found`);
  }
  
  return hasPrefix && hasSelect;
}

async function executeQuery(queryFile) {
  const content = fs.readFileSync(queryFile, 'utf-8');
  
  // Extract the first query (files may contain multiple queries as comments)
  const queries = content.split(/# -{5,}/);
  const firstQuery = queries[0];
  
  try {
    const response = await fetch(SPARQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/sparql-query',
        'Accept': 'application/json'
      },
      body: firstQuery
    });
    
    if (response.ok) {
      const results = await response.json();
      return {
        success: true,
        resultCount: results.results?.bindings?.length || 0
      };
    } else {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function main() {
  console.log('🔍 SKA SPARQL Query Validation\n');
  
  const queryFiles = fs.readdirSync(QUERIES_DIR)
    .filter(f => f.endsWith('.sparql'))
    .sort();
  
  console.log(`Found ${queryFiles.length} query files:\n`);
  
  let passCount = 0;
  let failCount = 0;
  
  for (const file of queryFiles) {
    const filePath = path.join(QUERIES_DIR, file);
    console.log(`📄 ${file}`);
    
    const syntaxValid = await validateQuerySyntax(filePath);
    
    if (syntaxValid) {
      console.log('  ✅ Syntax valid');
      passCount++;
      
      // Try to execute if endpoint is available
      if (process.env.TEST_EXECUTE) {
        const result = await executeQuery(filePath);
        if (result.success) {
          console.log(`  📊 Executed: ${result.resultCount} results`);
        } else {
          console.log(`  ⚠️  Execution failed: ${result.error}`);
        }
      }
    } else {
      console.log('  ❌ Syntax issues detected');
      failCount++;
    }
    
    console.log('');
  }
  
  console.log('────────────────────────────────');
  console.log(`Total: ${passCount} passed, ${failCount} failed`);
  
  if (failCount > 0) {
    process.exit(1);
  }
}

main().catch(console.error);
