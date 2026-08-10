import { createClient } from '@supabase/supabase-js';

const url = "https://dfyabughuiaufcjnsdek.supabase.co";
const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmeWFidWdodWlhdWZjam5zZGVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzNDQxODYsImV4cCI6MjEwMTkyMDE4Nn0.vAynw3GL8vFcbp3yLy5ey9rgjuS3GCppjNnDcjPQRvc";
const serviceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmeWFidWdodWlhdWZjam5zZGVrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjM0NDE4NiwiZXhwIjoyMTAxOTIwMTg2fQ.iVL93zE1ZuHX_4c3weTKPQZ_KLOFClBxPJa9d1LSpFs";

console.log('=== Supabase API & Connection Test ===');

async function testSupabase() {
  const supabase = createClient(url, serviceKey);

  console.log('Testing Supabase Service Role client query...');
  try {
    const { data, error, status } = await supabase.from('orders').select('*').limit(1);
    console.log('Status:', status);
    if (error) {
      console.log('API Result:', error.message);
      if (error.code === '42P01') {
        console.log('✅ Connection Successful! (Supabase connected to PostgreSQL; table "orders" needs creation in database schema).');
      } else {
        console.log('Error details:', error);
      }
    } else {
      console.log('✅ Connection Successful! Data returned:', data);
    }
  } catch (err) {
    console.error('Connection Error:', err);
  }
}

testSupabase();
