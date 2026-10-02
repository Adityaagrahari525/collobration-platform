import { dbService } from '../src/services/dbService.js';
import { supabase } from '../src/services/supabaseClient.js';

console.log('Is Supabase configured?', dbService.isConfigured());

async function testDbService() {
  console.log('Testing dbService methods...');

  const { data: profiles, error: profileErr } = await dbService.getProfiles();
  console.log('Profiles Query Result:', { count: profiles ? profiles.length : null, error: profileErr ? profileErr.message : null });

  const { data: questions, error: qErr } = await dbService.getQuestions();
  console.log('Questions Query Result:', { count: questions ? questions.length : null, error: qErr ? qErr.message : null });

  const { data: projects, error: pErr } = await dbService.getProjects();
  console.log('Projects Query Result:', { count: projects ? projects.length : null, error: pErr ? pErr.message : null });
}

testDbService();
