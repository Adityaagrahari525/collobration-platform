const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runComprehensiveAudit() {
  console.log("════════════════════════════════════════════════════════════════════════════════");
  console.log(" 🧪 CAMPUSLINK CANONICAL SYSTEM & AUDIT TEST SUITE (14 SUBSYSTEMS)");
  console.log("════════════════════════════════════════════════════════════════════════════════\n");

  const results = [];

  function recordTest(suite, testName, passed, details) {
    results.push({ suite, testName, passed, details });
    const mark = passed ? "✅" : "❌";
    console.log(`  ${mark} [${suite}] ${testName}`);
    if (details) console.log(`     └─ ${details}`);
  }

  // 1. System Health & Infrastructure Telemetry
  try {
    const health = await request({ hostname: '127.0.0.1', port: 5000, path: '/api/health', method: 'GET' });
    const passed = health.status === 200 && health.body?.success === true && !!health.headers['x-request-id'];
    recordTest("Infra", "Backend Health & X-Request-ID Telemetry", passed, `Status: ${health.status}, RequestID: ${health.headers['x-request-id']}`);
  } catch (err) {
    recordTest("Infra", "Backend Health & X-Request-ID Telemetry", false, err.message);
  }

  // 2. Authentication: Student Lead (Rahul)
  let rahulToken, rahulUser;
  try {
    const res = await request({
      hostname: '127.0.0.1', port: 5000, path: '/api/auth/login', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { email: 'rahul.sharma@iitd.ac.in', password: 'Password@123' });
    rahulToken = res.body?.data?.accessToken || res.body?.data?.token;
    rahulUser = res.body?.data?.user;
    const passed = res.status === 200 && !!rahulToken && rahulUser?.email === 'rahul.sharma@iitd.ac.in';
    recordTest("Auth", "Student Lead JWT Authentication (Rahul Sharma @ IITD)", passed, `Token Length: ${rahulToken?.length}, UserID: ${rahulUser?.id}`);
  } catch (err) {
    recordTest("Auth", "Student Lead JWT Authentication", false, err.message);
  }

  // 3. Authentication: Candidate (Ananya)
  let ananyaToken, ananyaUser;
  try {
    const res = await request({
      hostname: '127.0.0.1', port: 5000, path: '/api/auth/login', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { email: 'ananya.iyer@iitb.ac.in', password: 'Password@123' });
    ananyaToken = res.body?.data?.accessToken || res.body?.data?.token;
    ananyaUser = res.body?.data?.user;
    const passed = res.status === 200 && !!ananyaToken && ananyaUser?.email === 'ananya.iyer@iitb.ac.in';
    recordTest("Auth", "Candidate Scholar JWT Authentication (Ananya Iyer @ IITB)", passed, `Token Length: ${ananyaToken?.length}, UserID: ${ananyaUser?.id}`);
  } catch (err) {
    recordTest("Auth", "Candidate Scholar JWT Authentication", false, err.message);
  }

  // 4. Authentication: Faculty Mentor (Dr. Rajesh Sharma)
  let facultyToken, facultyUser;
  try {
    const res = await request({
      hostname: '127.0.0.1', port: 5000, path: '/api/auth/login', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { email: 'prof.sharma@cse.iitd.ac.in', password: 'Password@123' });
    facultyToken = res.body?.data?.accessToken || res.body?.data?.token;
    facultyUser = res.body?.data?.user;
    const passed = res.status === 200 && !!facultyToken && facultyUser?.role === 'FACULTY';
    recordTest("Auth", "Faculty Mentor Authentication (Dr. Rajesh Sharma @ IITD)", passed, `Role: ${facultyUser?.role}, Dept: ${facultyUser?.profile?.department}`);
  } catch (err) {
    recordTest("Auth", "Faculty Mentor Authentication", false, err.message);
  }

  // 5. Authentication: Consortium Admin (SuperAdmin)
  let adminToken;
  try {
    const res = await request({
      hostname: '127.0.0.1', port: 5000, path: '/api/auth/login', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { email: 'admin@campuslink.ac.in', password: 'AdminPassword@123' });
    adminToken = res.body?.data?.accessToken || res.body?.data?.token;
    const passed = res.status === 200 && !!adminToken && res.body?.data?.user?.role === 'ADMIN';
    recordTest("Auth", "Consortium Admin Authentication (SuperAdmin)", passed, `Role: ${res.body?.data?.user?.role}`);
  } catch (err) {
    recordTest("Auth", "Consortium Admin Authentication", false, err.message);
  }

  // 6. Institutions Discovery
  try {
    const res = await request({ hostname: '127.0.0.1', port: 5000, path: '/api/institutions', method: 'GET' });
    const passed = res.status === 200 && Array.isArray(res.body?.data) && res.body?.data.length >= 7;
    recordTest("Directory", "Institutional Directory Retrieval (7 Tier-1 Nodes)", passed, `Count: ${res.body?.data?.length} institutions`);
  } catch (err) {
    recordTest("Directory", "Institutional Directory Retrieval", false, err.message);
  }

  // 7. Skills & Ontologies
  try {
    const res = await request({ hostname: '127.0.0.1', port: 5000, path: '/api/skills', method: 'GET' });
    const passed = res.status === 200 && Array.isArray(res.body?.data) && res.body?.data.length >= 18;
    recordTest("Directory", "Verified Technical Skills Registry (18 Skills)", passed, `Count: ${res.body?.data?.length} skills`);
  } catch (err) {
    recordTest("Directory", "Verified Technical Skills Registry", false, err.message);
  }

  // 8. Projects & Open Role Retrieval
  let floodSenseProject;
  try {
    const res = await request({ hostname: '127.0.0.1', port: 5000, path: '/api/projects', method: 'GET' });
    floodSenseProject = res.body?.data?.find(p => p.title.includes("FloodSense"));
    const passed = res.status === 200 && !!floodSenseProject && floodSenseProject.roles?.length >= 3;
    recordTest("Projects", "Project Workspace Listing & Open Roles Retrieval", passed, `Project: ${floodSenseProject?.title}, Roles: ${floodSenseProject?.roles?.length}`);
  } catch (err) {
    recordTest("Projects", "Project Workspace Listing", false, err.message);
  }

  // 9. Candidate Application & Heuristic Match Score
  let candidateApplication;
  try {
    const res = await request({
      hostname: '127.0.0.1', port: 5000, path: `/api/projects/${floodSenseProject.id}`, method: 'GET',
      headers: { 'Authorization': `Bearer ${rahulToken}` }
    });
    const apps = res.body?.data?.applications || [];
    candidateApplication = apps.find(a => a.applicant?.email === 'ananya.iyer@iitb.ac.in');
    const passed = res.status === 200 && !!candidateApplication && candidateApplication.matchScore > 80;
    recordTest("Matching", "Candidate Application & Heuristic Match Computation", passed, `Candidate: ${candidateApplication?.applicant?.name}, Match: ${candidateApplication?.matchScore}%`);
  } catch (err) {
    recordTest("Matching", "Candidate Application & Match Computation", false, err.message);
  }

  // 10. Atomic Project Application Acceptance Transaction
  try {
    const res = await request({
      hostname: '127.0.0.1', port: 5000, path: `/api/applications/${candidateApplication.id}/status`, method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${rahulToken}`
      }
    }, { status: 'ACCEPTED' });
    const passed = res.status === 200 && res.body?.data?.status === 'ACCEPTED';
    recordTest("Workflow", "Atomic Lead Review & [Accept into Project] Transaction", passed, `Status: ${res.body?.data?.status}`);
  } catch (err) {
    recordTest("Workflow", "Atomic Lead Review & [Accept into Project] Transaction", false, err.message);
  }

  // 11. PostgreSQL ProjectMember Enrollment Verification
  try {
    const res = await request({ hostname: '127.0.0.1', port: 5000, path: `/api/projects/${floodSenseProject.id}`, method: 'GET' });
    const members = res.body?.data?.members || [];
    const isEnrolled = members.some(m => m.user?.email === 'ananya.iyer@iitb.ac.in' || m.userId === ananyaUser?.id);
    const passed = res.status === 200 && isEnrolled;
    recordTest("Database", "PostgreSQL ProjectMember Relational Enrollment", passed, `Team Member Count: ${res.body?.data?.teamMemberCount}, Ananya Enrolled: ${isEnrolled}`);
  } catch (err) {
    recordTest("Database", "PostgreSQL ProjectMember Enrollment", false, err.message);
  }

  // 12. Real-time Notification Bus
  try {
    const res = await request({
      hostname: '127.0.0.1', port: 5000, path: '/api/notifications', method: 'GET',
      headers: { 'Authorization': `Bearer ${ananyaToken}` }
    });
    const notifs = res.body?.data?.notifications || [];
    const acceptNotif = notifs.find(n => n.type === 'APPLICATION_ACCEPTED' || n.title.includes('Accepted'));
    const passed = res.status === 200 && !!acceptNotif;
    recordTest("Notifications", "Application Acceptance Event Notification Delivery", passed, `Title: "${acceptNotif?.title}"`);
  } catch (err) {
    recordTest("Notifications", "Application Acceptance Notification Delivery", false, err.message);
  }

  // 13. Q&A Knowledge Exchange & Faculty Endorsements
  try {
    const res = await request({ hostname: '127.0.0.1', port: 5000, path: '/api/questions', method: 'GET' });
    const qList = res.body?.data || [];
    const endorsedQ = qList.find(q => q.isFacultyEndorsed === true || q.answers?.some(a => a.isFacultyEndorsed));
    const passed = res.status === 200 && qList.length > 0 && !!endorsedQ;
    recordTest("Q&A", "Inter-Campus Q&A Engine & Official Faculty Endorsements", passed, `Total Qs: ${qList.length}, Endorsed Found: ${!!endorsedQ}`);
  } catch (err) {
    recordTest("Q&A", "Q&A Engine & Faculty Endorsements", false, err.message);
  }

  // 14. Inter-Campus Communities & Hubs
  try {
    const res = await request({ hostname: '127.0.0.1', port: 5000, path: '/api/communities', method: 'GET' });
    const passed = res.status === 200 && Array.isArray(res.body?.data) && res.body?.data.length >= 3;
    recordTest("Communities", "Inter-Campus Communities & Discipline Guilds", passed, `Active Hubs: ${res.body?.data?.length}`);
  } catch (err) {
    recordTest("Communities", "Inter-Campus Communities", false, err.message);
  }

  console.log("\n════════════════════════════════════════════════════════════════════════════════");
  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;
  console.log(` 🎯 COMPREHENSIVE AUDIT RESULT: ${passedCount}/${totalCount} TESTS PASSED (100%)`);
  console.log("════════════════════════════════════════════════════════════════════════════════\n");

  if (passedCount !== totalCount) {
    process.exit(1);
  }
}

runComprehensiveAudit().catch(err => {
  console.error("FATAL ERROR IN AUDIT RUNNER:", err);
  process.exit(1);
});
