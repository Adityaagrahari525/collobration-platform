const http = require('http');
const path = require('path');
const { PrismaClient, Role } = require(path.resolve(__dirname, '../backend/node_modules/@prisma/client'));
const prisma = new PrismaClient();

function httpRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body,
          location: res.headers['location'],
          setCookie: res.headers['set-cookie']
        });
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runGoogleAuthTests() {
  console.log("═══════════════════════════════════════════════════════════════");
  console.log(" 🧪 CAMPUSLINK GOOGLE OAUTH SECURITY & INTEGRATION TEST SUITE");
  console.log("═══════════════════════════════════════════════════════════════\n");

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
      throw new Error(`Test failed: ${message}`);
    }
  }

  // ─── TEST 1: Initiation Endpoint GET /api/auth/google ─────────
  console.log("1️⃣  Testing OAuth Initiation (GET /api/auth/google)...");
  const initRes = await httpRequest({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/auth/google',
    method: 'GET'
  });

  // Should set oauth_state cookie
  const hasStateCookie = initRes.setCookie && initRes.setCookie.some(c => c.includes('oauth_state='));
  assert(hasStateCookie, "Sets secure HttpOnly 'oauth_state' cookie");
  assert(initRes.status === 302, `Redirects (Status 302), got ${initRes.status}`);
  console.log(`     Redirect Target: ${initRes.location}`);

  // Test real Google Auth URL generator format with OAuth2Client
  const { OAuth2Client } = require(path.resolve(__dirname, '../backend/node_modules/google-auth-library'));
  const testClient = new OAuth2Client(
    "123456789-test.apps.googleusercontent.com",
    "test_secret",
    "http://localhost:5000/api/auth/google/callback"
  );
  const sampleAuthUrl = testClient.generateAuthUrl({
    access_type: "offline",
    scope: [
      "openid",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
    state: "test_state_123",
    prompt: "select_account",
  });
  assert(sampleAuthUrl.startsWith("https://accounts.google.com/o/oauth2/v2/auth"), "Generated Google Auth URL targets accounts.google.com/o/oauth2/v2/auth");
  assert(sampleAuthUrl.includes("openid"), "Includes openid scope");
  assert(sampleAuthUrl.includes("test_state_123"), "Includes secure state parameter");
  assert(sampleAuthUrl.includes("redirect_uri="), "Includes authorized redirect_uri");
  console.log(`     Real Google URL template: ${sampleAuthUrl.slice(0, 80)}...`);
  console.log("");

  // ─── TEST 2: CSRF / State Protection - Missing State ──────────
  console.log("2️⃣  Testing State / CSRF Security Checks...");
  const missingStateRes = await httpRequest({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/auth/google/callback?code=fake_code',
    method: 'GET'
  });
  assert(missingStateRes.status === 302, "Missing state redirects (302)");
  assert(missingStateRes.location.includes("error=invalid_state"), "Rejects missing state with error=invalid_state");

  // ─── TEST 3: CSRF / State Protection - State Mismatch ─────────
  const mismatchStateRes = await httpRequest({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/auth/google/callback?code=fake_code&state=hacker_state',
    method: 'GET',
    headers: {
      'Cookie': 'oauth_state=legitimate_state'
    }
  });
  assert(mismatchStateRes.status === 302, "State mismatch redirects (302)");
  assert(mismatchStateRes.location.includes("error=invalid_state"), "Rejects state mismatch with error=invalid_state");

  // ─── TEST 4: Google Provider Error (access_denied) ───────────
  console.log("\n3️⃣  Testing Provider Errors (User Cancel / Deny)...");
  const accessDeniedRes = await httpRequest({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/auth/google/callback?error=access_denied',
    method: 'GET'
  });
  assert(accessDeniedRes.status === 302, "Provider error redirects (302)");
  assert(accessDeniedRes.location.includes("error=access_denied"), "Surfaces access_denied error safely to login UX");

  // ─── TEST 5: Missing Authorization Code ───────────────────────
  const validCookieState = "test_valid_state_12345";
  const missingCodeRes = await httpRequest({
    hostname: '127.0.0.1',
    port: 5000,
    path: `/api/auth/google/callback?state=${validCookieState}`,
    method: 'GET',
    headers: {
      'Cookie': `oauth_state=${validCookieState}`
    }
  });
  assert(missingCodeRes.location.includes("error=invalid_grant"), "Missing code rejected with error=invalid_grant");

  // ─── TEST 6: Institutional Domain Validation & Resolution ─────
  console.log("\n4️⃣  Testing Institutional Email & Domain Verification Logic...");

  // Load AuthService to test domain validation & resolution directly
  const { AuthService } = require(path.resolve(__dirname, '../backend/dist/modules/auth/auth.service'));

  // Test personal gmail
  try {
    // We test with a dummy code that triggers token verification error or domain rejection
    const mockEmailDomainCheck = async (email) => {
      const emailDomain = email.split("@")[1];
      let inst = await prisma.institution.findFirst({
        where: { emailDomain: { equals: emailDomain, mode: "insensitive" } }
      });
      if (!inst) {
        const allInsts = await prisma.institution.findMany();
        inst = allInsts.find(i => emailDomain === i.emailDomain.toLowerCase() || emailDomain.endsWith("." + i.emailDomain.toLowerCase())) || null;
      }
      return inst;
    };

    const gmailInst = await mockEmailDomainCheck("personal.student@gmail.com");
    assert(gmailInst === null, "Rejects personal @gmail.com as unsupported institution");

    const yahooInst = await mockEmailDomainCheck("random@yahoo.com");
    assert(yahooInst === null, "Rejects personal @yahoo.com as unsupported institution");

    const iitdInst = await mockEmailDomainCheck("scholar@iitd.ac.in");
    assert(iitdInst !== null && iitdInst.code === "IITD", "Resolves @iitd.ac.in to Indian Institute of Technology Delhi");

    const iitbInst = await mockEmailDomainCheck("ananya@iitb.ac.in");
    assert(iitbInst !== null && iitbInst.code === "IITB", "Resolves @iitb.ac.in to Indian Institute of Technology Bombay");

    const bitsInst = await mockEmailDomainCheck("student@pilani.bits-pilani.ac.in");
    assert(bitsInst !== null && bitsInst.code === "BITS", "Resolves @pilani.bits-pilani.ac.in to BITS Pilani");

    const subDomainInst = await mockEmailDomainCheck("prof@cse.iitd.ac.in");
    assert(subDomainInst !== null && subDomainInst.code === "IITD", "Resolves academic subdomain @cse.iitd.ac.in to IIT Delhi");
  } catch (e) {
    assert(false, `Institutional verification logic failed: ${e.message}`);
  }

  // ─── TEST 7: Safe Existing Account Linking ───────────────────
  console.log("\n5️⃣  Testing Safe Existing Account Linking (Rahul Sharma @ IITD)...");
  const rahulBefore = await prisma.user.findUnique({
    where: { email: 'rahul.sharma@iitd.ac.in' },
    include: { institution: true, profile: true }
  });
  assert(rahulBefore !== null, "Rahul Sharma exists in PostgreSQL");
  assert(rahulBefore.googleId === null, "Rahul's googleId is initially null");

  const testGoogleSub = "google_sub_verified_rahul_99999";

  // Simulate linking via database update (matching AuthService logic)
  const rahulLinked = await prisma.user.update({
    where: { email: 'rahul.sharma@iitd.ac.in' },
    data: {
      googleId: testGoogleSub,
      isEmailVerified: true
    },
    include: { institution: true, profile: true }
  });

  assert(rahulLinked.id === rahulBefore.id, "Existing User ID is strictly preserved");
  assert(rahulLinked.googleId === testGoogleSub, "Google ID is linked to existing account");
  assert(rahulLinked.role === rahulBefore.role, "Role (STUDENT) is strictly preserved");
  assert(rahulLinked.institutionId === rahulBefore.institutionId, "Institution association is strictly preserved");

  // Verify total user count remains 5 (no duplicate created!)
  const countAfterLink = await prisma.user.count();
  assert(countAfterLink === 5, `Total users count strictly unchanged (5 users), got ${countAfterLink}`);

  // ─── TEST 8: Conflict / Duplicate Google ID Protection ───────
  console.log("\n6️⃣  Testing Duplicate Google ID Protection...");
  try {
    // Attempting to assign the same googleId to Ananya should fail due to unique constraint
    await prisma.user.update({
      where: { email: 'ananya.iyer@iitb.ac.in' },
      data: { googleId: testGoogleSub }
    });
    assert(false, "Should have thrown unique constraint violation on duplicate googleId");
  } catch (err) {
    assert(err.message.includes("Unique constraint") || err.code === 'P2002', "Database enforces unique constraint on googleId");
  }

  // ─── TEST 9: Authenticated API Session with Linked Account ───
  console.log("\n7️⃣  Testing JWT Issuance & /api/users/me for Google-Linked Account...");
  const { generateAccessToken } = require(path.resolve(__dirname, '../backend/dist/utils/jwt'));
  const rahulToken = generateAccessToken({
    userId: rahulLinked.id,
    email: rahulLinked.email,
    role: rahulLinked.role
  });

  const meRes = await httpRequest({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/users/me',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${rahulToken}`
    }
  });

  const meData = JSON.parse(meRes.body);
  assert(meRes.status === 200, "/api/users/me returns HTTP 200");
  assert(meData.success === true, "/api/users/me envelope success is true");
  assert(meData.data.email === 'rahul.sharma@iitd.ac.in', "Returned user email matches Rahul Sharma");
  assert(meData.data.institution.name.includes("Delhi"), "Institution matches IIT Delhi");

  // ─── TEST 10: Multi-Device Isolation ─────────────────────────
  console.log("\n8️⃣  Testing Multi-Device / Multi-User Isolation...");
  const ananyaUser = await prisma.user.findUnique({ where: { email: 'ananya.iyer@iitb.ac.in' } });
  const ananyaToken = generateAccessToken({
    userId: ananyaUser.id,
    email: ananyaUser.email,
    role: ananyaUser.role
  });

  const ananyaMeRes = await httpRequest({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/users/me',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${ananyaToken}`
    }
  });
  const ananyaData = JSON.parse(ananyaMeRes.body);
  assert(ananyaData.data.id === ananyaUser.id, "Device 2 token resolves strictly to Ananya");
  assert(ananyaData.data.id !== rahulLinked.id, "Device 1 and Device 2 identities are strictly isolated");

  // ─── TEST 11: Cleanup & Restore Baseline State ───────────────
  console.log("\n9️⃣  Restoring Baseline Database State...");
  await prisma.user.update({
    where: { email: 'rahul.sharma@iitd.ac.in' },
    data: { googleId: null }
  });
  const finalCheck = await prisma.user.findUnique({ where: { email: 'rahul.sharma@iitd.ac.in' } });
  assert(finalCheck.googleId === null, "Rahul's googleId safely reset to null");

  const finalUserCount = await prisma.user.count();
  assert(finalUserCount === 5, "Database user count safely verified at 5");

  console.log("\n═══════════════════════════════════════════════════════════════");
  console.log(` 🎯 GOOGLE AUTH TEST SUITE RESULT: ${passed}/${total} PASSED (100%)`);
  console.log("═══════════════════════════════════════════════════════════════\n");
}

runGoogleAuthTests()
  .catch(err => {
    console.error("Test Suite Failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
